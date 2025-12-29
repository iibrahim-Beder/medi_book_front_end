import { useState, useEffect, useCallback, useRef } from "react";
import {
  useGetChatMessagesQuery,
  useSendMessageMutation,
} from "../../../api/chat/doctorChatApi";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { doctorChatApi } from "../../../api/chat/doctorChatApi";
import { useDispatch, useSelector } from "react-redux";
import { audioService } from "../../notifications/audioService";

export const useMessages = () => {
  const dispatch = useDispatch();

  const selectedChat = useSelector((state) => state.chats.selectedChatId);

  const [pageByChat, setPageByChat] = useState({});

  const currentPage = pageByChat[selectedChat] ?? 1;

  const pageSizeMessage = 30;

  const lastReceivedMessage = useRef(null);

  //  WebSocket hooks
  const {
    isConnected,
    onMessageReceived,
    onMessageStatusUpdated,
    updateMessageStatus,
    InvokeMarkFromLastMessagesAsRead,
    onMarkAllMessagesAsRead,
  } = useSignalR();

  const {
    data: messagesData,
    isLoading: messagesLoading,
    isError: messagesIsError,
    isFetching,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery(
    selectedChat
      ? {
          PersonId: 1,
          chatId: selectedChat,
          pageNumber: currentPage,
          pageSize: pageSizeMessage,
        }
      : null
  );
    const currentMessages = messagesData?.data ?? [];

  const [sendMessageApi, { isLoading: isSending }] = useSendMessageMutation();
  const chatContainerRef = useRef(null);
  const toLatestMessage = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  const loadMore = () => {
    console.log("==loadMore hasNextPage", messagesData.hasNextPage) ;
    if(!messagesData.hasNextPage||isFetching)return
    setPageByChat((prev) => ({
      ...prev,
      [selectedChat]: (prev[selectedChat] ?? 1) + 1,
    }));
  };

  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;

    if (Math.abs(el.scrollTop) + el.clientHeight >= el.scrollHeight - 5) {
      loadMore();
    }
  };
  // in selectedChat change
  useEffect(() => {
    console.log("==useEffect"  ,"loading",messagesLoading  ,"the condition" ,(isConnected&& selectedChat&&  currentMessages?.length > 0 &&currentMessages[0]?.id) );
    setPageByChat((prev) => ({
      ...prev,
      [selectedChat]: 1,
    }));
    toLatestMessage();
    if(isConnected&& selectedChat&&  currentMessages?.length > 0 &&currentMessages[0]?.id){
      InvokeMarkFromLastMessagesAsRead(selectedChat,currentMessages[0]?.id);
      markMessagesAsRead();
    }
  }, [selectedChat,messagesLoading,isConnected]);
  
  // handle new message
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("New message received from WebSocket:", message);
      if (selectedChat === message.chatId) {
        audioService.play('messageArrivedChatIn')
        updateMessageStatus( message.chatId  , message.messageId, 2);
      } else {
        updateMessageStatus( message.chatId  , message.messageId, 1);
      }
      // ===== (RTK Query) =====
      dispatch(
        doctorChatApi.util.updateQueryData(
          "getChatMessages",
          {
            PersonId: 1,
            chatId: message.chatId,
            pageNumber: 1,
            pageSize: pageSizeMessage,
          },
          (draft) => {
            if (!draft?.data) return;

            const exists = draft.data.some((m) => m.id === message.messageId);

            if (!exists) {
              message.id = message.messageId;
              draft.data.unshift(message);
            }
          }
        )
      );

      dispatch(
        doctorChatApi.util.updateQueryData(
          "getDoctorChats",
           undefined,
          (draft) => {
            if (!draft?.data) return;

            const chat = draft.data.find((c) => c.chatId === message.chatId);

            if (chat) {
              chat.lastMessage = message.content;
              chat.lastMessageTime = message.sentAt || new Date().toISOString();
              chat.lastMessageIsMine = false;
              chat.lastMessageStatus = message.status || "Delivered";

              if (
                message.senderId !== message.currentUserId &&
                selectedChat !== message.chatId
              ) {
                chat.unreadCount = (chat.unreadCount || 0) + 1;
              }
            }

            draft.data.sort(
              (a, b) =>
                new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
            );
          }
        )
      );
    };

    if (isConnected) {
      onMessageReceived(handleNewMessage);
    }
  }, [isConnected, onMessageReceived, selectedChat]);

  useEffect(() => {
    const handleMessageStatusUpdate = (statusUpdate) => {
      console.log("==Message status update from WebSocket :", statusUpdate);
      console.log("==MessagesData :", messagesData);
      dispatch(
        doctorChatApi.util.updateQueryData(
          "getChatMessages",
          {
            PersonId: 1,
            chatId: statusUpdate.chatId,
            pageNumber: 1,
            pageSize: pageSizeMessage,
          },
          (draft) => {
            if (!draft?.data) return;

            draft.data.forEach((msg) => {
              if (statusUpdate.messageId === msg.id) {
                msg.status = statusUpdate.messageStatus;
              }
            });
          }
        )
      );

      // if (statusUpdate.status === 'Seen') {
      //   dispatch(
      //     doctorChatApi.util.updateQueryData(
      //       'getDoctorChats',
      //        undefined,
      //       (draft) => {
      //         if (!draft?.data) return;

      //         const chat = draft.data.find(
      //           c => c.chatId === statusUpdate.chatId
      //         );

      //         if (chat) {
      //           chat.lastMessageStatus = 'Seen';
      //           chat.unreadCount = 0;
      //         }
      //       }
      //     )
      //   );
      // }

    };

    onMessageStatusUpdated(handleMessageStatusUpdate);
  }, [isConnected, onMessageStatusUpdated]);
  // on 
  useEffect(() => {
    const handleMessageMarkfromlastmessageasread = (MessageMark) => {
      console.log("==  onMarkAllMessagesAsRead from WebSocket :", MessageMark);
      dispatch(
        doctorChatApi.util.updateQueryData(
          "getChatMessages",
          {
            PersonId: 1,
            chatId: MessageMark.chatId,
            pageNumber: 1,
            pageSize: pageSizeMessage,
          },
          (draft) => {
            if (!draft?.data) return;

            draft.data.forEach((msg) => {
              if (MessageMark.lastReadMessageId >= msg.id) {
                msg.status = 2;
              }
            });
          }
        )
      );  

        dispatch(
          doctorChatApi.util.updateQueryData(
            'getDoctorChats',
            undefined,
            (draft) => {
              if (!draft?.data) return;

              const chat = draft.data.find(
                c => c.chatId === MessageMark.chatId
              );

              if (chat) {
                chat.lastMessageStatus =2;
              }
            }
          )
        );

    };
    if (isConnected)  {
      onMarkAllMessagesAsRead(handleMessageMarkfromlastmessageasread);
    }

  }, [isConnected, onMarkAllMessagesAsRead]);

  const sendMessage = useCallback(
    async (content, chatId = selectedChat) => {
      if (!content.trim() || !chatId) return null;
      const tempMessage = {
        chatId: chatId,
        senderId: 1,
        content: content,
        sentAt: new Date().toISOString(),
        isMine: true,
        status: 4,
        messageId: new Date().toISOString(),
      };

      // ===== update the cache (RTK Query) =====
      dispatch(
        doctorChatApi.util.updateQueryData(
          "getChatMessages",
          {
            PersonId: 1,
            chatId: tempMessage.chatId,
            pageNumber: 1,
            pageSize: pageSizeMessage,
          },
          (draft) => {
            if (!draft?.data) return;

            const exists = draft.data.some(
              (m) => m.id === tempMessage.messageId
            );

            if (!exists) {
              tempMessage.id = tempMessage.messageId;
              draft.data.unshift(tempMessage);
            }
          }
        )
      );

      dispatch(
        doctorChatApi.util.updateQueryData(
          "getDoctorChats",
           undefined,
          (draft) => {
            if (!draft?.data) return;

            const chat = draft.data.find(
              (c) => c.chatId === tempMessage.chatId
            );

            if (chat) {
              chat.lastMessage = tempMessage.content;
              chat.lastMessageTime =
                tempMessage.sentAt || new Date().toISOString();
              chat.lastMessageIsMine = true;
              chat.lastMessageStatus = tempMessage.status || 4;

              if (
                tempMessage.senderId !== tempMessage.currentUserId &&
                selectedChat !== tempMessage.chatId
              ) {
                chat.unreadCount = (chat.unreadCount || 0) + 1;
              }
            }

            // to sort by lastMessageTime
            draft.data.sort(
              (a, b) =>
                new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
            );
          }
        )
      );
       audioService.play('sendMessage');
      try {

        const result = await sendMessageApi(tempMessage).unwrap();
        // console.log('result', result);
        if (result.succeeded) {
          console.log("success result:  ", result);

          dispatch(
            doctorChatApi.util.updateQueryData(
              "getChatMessages",
              {
                PersonId: 1,
                chatId: selectedChat,
                pageNumber: 1,
                pageSize: pageSizeMessage,
              },
              (draft) => {
                if (!draft?.data) return;
                draft.data.forEach((msg) => {
                  if (tempMessage.id === msg.id) {
                    msg.id = result.data.messageId;
                    msg.status = result.data.messageStatus;
                    msg.sentAtFormatted = result.data.sentAt;
                    msg.isDelivered = result.data.isDelivered;
                  }
                });
              }
            )
          );
        }

        // console.log('Message sent successfully resalt:', result);

        // return result;
      } catch (error) {
        console.error("Error sending message:", error);

        try {
          dispatch(
            doctorChatApi.util.updateQueryData(
              "getChatMessages",
              {
                PersonId: 1,
                chatId: selectedChat,
                pageNumber: 1,
                pageSize: pageSizeMessage,
              },
              (draft) => {
                if (!draft?.data) return;
                draft.data.forEach((msg) => {
                  if (tempMessage.id === msg.id) {
                    msg.status = 3;
                  }
                });
              }
            )
          );
        } catch {}
        throw error;
      }
    },

    [selectedChat, sendMessageApi]
  );

  //mark all Messages As Read
  const markMessagesAsRead = 
    async () => {
              dispatch(
          doctorChatApi.util.updateQueryData(
            'getDoctorChats',
            undefined,
            (draft) => {
              if (!draft?.data) return;

              const chat = draft.data.find(
                c => c.chatId === selectedChat
              );

              if (chat) {
                chat.lastMessageStatus =2;
                chat.unreadCount = 0;
              }
            }
          )
        );}

  return {
    messages: currentMessages,
    messagesLoading: selectedChat ? messagesLoading : false,
    messagesIsError: selectedChat ? messagesIsError : false,
    refetchMessages,
    isLoadingOlderMessages :isFetching&&pageByChat[selectedChat]>1,
    isLoadingNewerMessages :isFetching&&pageByChat[selectedChat]===1,
    sendMessage,
    isSending,
    handleScroll,
    chatContainerRef,
    toLatestMessage,

    markMessagesAsRead,

    // WebSocket
    lastMessage: lastReceivedMessage.current,
  };
};