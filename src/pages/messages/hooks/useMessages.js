import { useState, useEffect, useCallback, useRef } from "react";
import {
  useGetChatMessagesQuery,
  useSendMessageMutation,
} from "../../../api/chat/doctorChatApi";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { doctorChatApi } from "../../../api/chat/doctorChatApi";
import { useDispatch, useSelector } from "react-redux";
import { useConversations } from "./useConversations";

export const useMessages = () => {
  const dispatch = useDispatch();

  const { setConversationsMap } = useConversations();
  const selectedChat = useSelector((state) => state.chats.selectedChatId);
  console.log("selectedChatId", selectedChat);

  const [pageByChat, setPageByChat] = useState({});
  const currentPage = pageByChat[selectedChat] ?? 1;

  const pageSizeMessage = 30;

  const lastReceivedMessage = useRef(null);

  //  WebSocket hooks
  const {
    getIsconnection,
    onMessageReceived,
    onMessageStatusUpdated,
    updateMessageStatus,
    InvokeMarkFromLastMessagesAsRead,
    onMarkAllMessagesAsRead,
    markAsRead: markAsReadViaWS,
  } = useSignalR();

  const {
    data: messagesData,
    isLoading: messagesLoading,
    isError: messagesIsError,
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

  console.log("messagesData", messagesData);
  const [sendMessageApi, { isLoading: isSending }] = useSendMessageMutation();
  const chatContainerRef = useRef(null);
  const toLatestMessage = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    console.log("el.scrollHeight", el.scrollHeight);
    el.scrollTop = el.scrollHeight;
  };

  const loadMore = () => {
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
    setPageByChat((prev) => ({
      ...prev,
      [selectedChat]: 1,
    }));
    toLatestMessage();
    if(getIsconnection()&& selectedChat&& currentMessages){
      InvokeMarkFromLastMessagesAsRead(selectedChat,currentMessages[0]?.id);
      console.log("selectedChat", selectedChat,"messageId", currentMessages[0]?.id);
    }
  }, [selectedChat]);
  
  // console.log("selectedChat", selectedChat,"messageId", currentMessages[0]?.id);
  // handle new message
  useEffect(() => {
    const handleNewMessage = (message) => {
      const chatIdStr = message.chatId.toString();
      setConversationsMap((prev) => {
        const updated = { ...prev };

        if (updated[chatIdStr]) {
          updated[chatIdStr] = {
            ...updated[chatIdStr],
            lastMessage: message.content,
            lastMessageIsMine: false,
            lastMessageTime: message.sentAt || new Date().toISOString(),
            //
            unreadCount:
              message.senderId !== message.currentUserId &&
              selectedChat !== message.chatId
                ? (updated[chatIdStr].unreadCount || 0) + 1
                : updated[chatIdStr].unreadCount,
          };
        }

        return updated;
      });
      console.log("New message received from WebSocket:", message);
      if (selectedChat === message.chatId) {
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
          {
            pageNumber: 1,
            pageSize: 10,
          },
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

    if (getIsconnection) {
      onMessageReceived(handleNewMessage);
    }
  }, [getIsconnection, onMessageReceived, selectedChat]);

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
      //       {
      //         pageNumber: 1,
      //         pageSize: 10,
      //       },
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

      const chatIdStr = statusUpdate.chatId.toString();
      if (statusUpdate.status === "Seen") {
        setConversationsMap((prev) => {
          const updated = { ...prev };

          if (updated[chatIdStr]) {
            updated[chatIdStr] = {
              ...updated[chatIdStr],
              unreadCount: Math.max(
                0,
                (updated[chatIdStr].unreadCount || 0) - statusUpdate.seenCount
              ),
            };
          }

          return updated;
        });
      }
    };

    onMessageStatusUpdated(handleMessageStatusUpdate);
  }, [getIsconnection, onMessageStatusUpdated]);
  // on 
  useEffect(() => {
    const handleMessageMarkfromlastmessageasread = (MessageMark) => {
      console.log("==  onMarkAllMessagesAsRead from WebSocket :", MessageMark);
      console.log("==MessagesData :", messagesData);
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

      // if (MessageMark.status === 'Seen') {
        dispatch(
          doctorChatApi.util.updateQueryData(
            'getDoctorChats',
            {
              pageNumber: 1,
              pageSize: 10,
            },
            (draft) => {
              if (!draft?.data) return;

              const chat = draft.data.find(
                c => c.chatId === MessageMark.chatId
              );

              if (chat) {
                chat.lastMessageStatus =2;
                chat.unreadCount = 0;
              }
            }
          )
        );
      // }

      const chatIdStr = MessageMark.chatId.toString();
      // if (MessageMark.status === "Seen") {
        setConversationsMap((prev) => {
          const updated = { ...prev };

          if (updated[chatIdStr]) {
            updated[chatIdStr] = {
              ...updated[chatIdStr],
              unreadCount: 0
            };
          }

          return updated;
        });
      // }
    };
    if (getIsconnection)  {
      onMarkAllMessagesAsRead(handleMessageMarkfromlastmessageasread);
    }

  }, [getIsconnection, onMarkAllMessagesAsRead]);

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
          {
            pageNumber: 1,
            pageSize: 10,
          },
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

      try {
        const chatIdStr = chatId.toString();

        setConversationsMap((prev) => {
          const updated = { ...prev };
          if (updated[chatIdStr]) {
            updated[chatIdStr] = {
              ...updated[chatIdStr],
              lastMessage: content,
              lastMessageIsMine: true,
              lastMessageTime: tempMessage.sentAt,
            };
          }
          return updated;
        });

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
  const markMessagesAsRead = useCallback(
    async (chatId) => {
      if (!chatId) return;

      try {
        const chatIdStr = chatId.toString();
        setConversationsMap((prev) => {
          const updated = { ...prev };
          if (updated[chatIdStr]) {
            updated[chatIdStr] = {
              ...updated[chatIdStr],
              unreadCount: 0,
            };
          }
          return updated;
        });

        // Mark messages as read via WebSocket
        await markAsReadViaWS(chatId);

        // await markAsReadApi({ chatId: parseInt(chatId) }).unwrap();
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    },
    [markAsReadViaWS]
  );


  return {
    messages: currentMessages,
    messagesLoading: selectedChat ? messagesLoading : false,
    messagesIsError: selectedChat ? messagesIsError : false,
    refetchMessages,

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
