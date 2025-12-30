import { useState, useEffect, useCallback, useRef } from "react";
import {
  useGetChatMessagesQuery,
  useSendMessageMutation,
} from "../../../api/chat/doctorChatApi";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { doctorChatApi } from "../../../api/chat/doctorChatApi";
import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD

export const useMessages = () => {
  const dispatch = useDispatch();

  const selectedChat = useSelector((state) => state.chats.selectedChatId);
  console.log("selectedChatId", selectedChat);

  const [pageByChat, setPageByChat] = useState({});
=======
import { audioService } from "../../notifications/audioService";
const MessageStatus = {
  "Sent":0,
  "Delivered":1,
  "Read":2,
  "Failed":3,
  "Sending":4
};
export const useMessages = () => {
  const dispatch = useDispatch();

  const selectedChat = useSelector((state) => state.chats.selectedChatId)||-1;
  const isChatOpen   = useSelector((state) => state.chats.isChatOpen);
  const [pageByChat, setPageByChat] = useState({});

>>>>>>> Messages-ui
  const currentPage = pageByChat[selectedChat] ?? 1;

  const pageSizeMessage = 30;

  const lastReceivedMessage = useRef(null);

  //  WebSocket hooks
  const {
<<<<<<< HEAD
    getIsconnection,
=======
    isConnected,
>>>>>>> Messages-ui
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
<<<<<<< HEAD
=======
    isFetching,
>>>>>>> Messages-ui
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

<<<<<<< HEAD
  console.log("messagesData", messagesData);
=======
>>>>>>> Messages-ui
  const [sendMessageApi, { isLoading: isSending }] = useSendMessageMutation();
  const chatContainerRef = useRef(null);
  const toLatestMessage = () => {
    const el = chatContainerRef.current;
    if (!el) return;
<<<<<<< HEAD
    console.log("el.scrollHeight", el.scrollHeight);
=======
>>>>>>> Messages-ui
    el.scrollTop = el.scrollHeight;
  };

  const loadMore = () => {
<<<<<<< HEAD
=======
    console.log("==loadMore hasNextPage", messagesData.hasNextPage) ;
    if(!messagesData.hasNextPage||isFetching)return
>>>>>>> Messages-ui
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
<<<<<<< HEAD
=======
  console.log("===render===");
>>>>>>> Messages-ui
  // in selectedChat change
  useEffect(() => {
    setPageByChat((prev) => ({
      ...prev,
      [selectedChat]: 1,
    }));
    toLatestMessage();
<<<<<<< HEAD
    if(getIsconnection()&& selectedChat&& currentMessages){
      InvokeMarkFromLastMessagesAsRead(selectedChat,currentMessages[0]?.id);
      markMessagesAsRead();
      console.log("selectedChat", selectedChat,"messageId", currentMessages[0]?.id);
    }
    markMessagesAsRead();
  }, [selectedChat]);
  
  // console.log("selectedChat", selectedChat,"messageId", currentMessages[0]?.id);
=======
    if(!isConnected)return;
    if(isConnected&& selectedChat!==-1&&  currentMessages?.length > 0 &&currentMessages[0]?.id){
      console.log("==useEffect"  ,"loading",messagesLoading  ,"the condition" ,(isConnected&& selectedChat&&  currentMessages?.length > 0 &&currentMessages[0]?.id) );
      InvokeMarkFromLastMessagesAsRead(selectedChat,currentMessages[0]?.id);
      markMessagesAsRead();
    }
  }, [selectedChat,messagesLoading,isConnected]);
  
>>>>>>> Messages-ui
  // handle new message
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("New message received from WebSocket:", message);
<<<<<<< HEAD
      if (selectedChat === message.chatId) {
        updateMessageStatus( message.chatId  , message.messageId, 2);
      } else {
        updateMessageStatus( message.chatId  , message.messageId, 1);
=======
      if (selectedChat === message.chatId&& isChatOpen) {
        console.log("====================WebSocket:", isChatOpen);
        audioService.play('messageArrivedChatIn')
        updateMessageStatus( message.chatId  , message.messageId, MessageStatus.Read);
      } else {
        updateMessageStatus( message.chatId  , message.messageId, MessageStatus.Delivered);
>>>>>>> Messages-ui
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

<<<<<<< HEAD
    if (getIsconnection) {
      onMessageReceived(handleNewMessage);
    }
  }, [getIsconnection, onMessageReceived, selectedChat]);
=======
    if (isConnected) {
      onMessageReceived(handleNewMessage);
    }
  }, [isConnected, onMessageReceived, selectedChat, isChatOpen]);
>>>>>>> Messages-ui

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
<<<<<<< HEAD

    onMessageStatusUpdated(handleMessageStatusUpdate);
  }, [getIsconnection, onMessageStatusUpdated]);
=======
  if(isConnected){
    onMessageStatusUpdated(handleMessageStatusUpdate);
  }
  }, [isConnected, onMessageStatusUpdated]);
>>>>>>> Messages-ui
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
<<<<<<< HEAD
                msg.status = 2;
=======
                msg.status = MessageStatus.Read;
>>>>>>> Messages-ui
              }
            });
          }
        )
<<<<<<< HEAD
      );
=======
      );  
>>>>>>> Messages-ui

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
<<<<<<< HEAD
                chat.lastMessageStatus =2;
=======
                chat.lastMessageStatus =MessageStatus.Read;
>>>>>>> Messages-ui
              }
            }
          )
        );

    };
<<<<<<< HEAD
    if (getIsconnection)  {
      onMarkAllMessagesAsRead(handleMessageMarkfromlastmessageasread);
    }

  }, [getIsconnection, onMarkAllMessagesAsRead]);
=======
    if (isConnected)  {
      onMarkAllMessagesAsRead(handleMessageMarkfromlastmessageasread);
    }

  }, [isConnected, onMarkAllMessagesAsRead]);
>>>>>>> Messages-ui

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
<<<<<<< HEAD
              chat.lastMessageStatus = tempMessage.status || 4;
=======
              chat.lastMessageStatus = MessageStatus.Sending || 4;
>>>>>>> Messages-ui

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
<<<<<<< HEAD

=======
       audioService.play('sendMessage');
>>>>>>> Messages-ui
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
<<<<<<< HEAD

        try {
=======
>>>>>>> Messages-ui
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
<<<<<<< HEAD
                    msg.status = 3;
=======
                    msg.status = MessageStatus.Failed;
>>>>>>> Messages-ui
                  }
                });
              }
            )
          );
<<<<<<< HEAD
        } catch {}
        throw error;
=======
        
        // throw error;
>>>>>>> Messages-ui
      }
    },

    [selectedChat, sendMessageApi]
  );

<<<<<<< HEAD
=======
const resendMessage = useCallback(
  async (message) => {
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
          const msg = draft.data.find((m) => m.id === message.id);
          if (msg) {
            msg.status = MessageStatus.Sending;
          }
        }
      )
    );

    try {
      const result = await sendMessageApi(message).unwrap();

      if (result.succeeded) {
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
              const msg = draft.data.find((m) => m.id === message.id);
              if (msg) {
                msg.id = result.data.messageId;
                msg.status = result.data.messageStatus;
                msg.isDelivered = result.data.isDelivered;
                msg.sentAtFormatted = result.data.sentAt;
              }
            }
          )
        );
      }
    } catch (error) {
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
            const msg = draft.data.find((m) => m.id === message.id);
            if (msg) {
              msg.status = MessageStatus.Failed;
            }
          }
        )
      );
    }
  },
  [sendMessageApi]
);

>>>>>>> Messages-ui
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

<<<<<<< HEAD
  //   },
  // );

=======
>>>>>>> Messages-ui
  return {
    messages: currentMessages,
    messagesLoading: selectedChat ? messagesLoading : false,
    messagesIsError: selectedChat ? messagesIsError : false,
    refetchMessages,
<<<<<<< HEAD

    sendMessage,
=======
    isLoadingOlderMessages :isFetching&&pageByChat[selectedChat]>1,
    isLoadingNewerMessages :isFetching&&pageByChat[selectedChat]===1,
    sendMessage,
    resendMessage,
>>>>>>> Messages-ui
    isSending,
    handleScroll,
    chatContainerRef,
    toLatestMessage,
<<<<<<< HEAD

    markMessagesAsRead,

    // WebSocket
    lastMessage: lastReceivedMessage.current,
  };
};
=======
    // WebSocket
    lastMessage: lastReceivedMessage.current,
  };
};
>>>>>>> Messages-ui
