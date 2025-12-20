import { useState, useEffect, useCallback, useRef } from 'react';
import {  
  useGetChatMessagesQuery,
  useSendMessageMutation,
} from '../../../api/chat/doctorChatApi';
import { useSignalR } from '../../../api/chat/chatUseSignalR';
import {doctorChatApi} from '../../../api/chat/doctorChatApi';
import { useDispatch, useSelector } from 'react-redux';
import { useConversations } from './useConversations';

export const useMessages = () => {
    const{
      setConversationsMap,
    } = useConversations();
      
    const dispatch = useDispatch();
    
    
      const selectedChat = useSelector((state) => state.chats.selectedChatId);
    console.log("selectedChatId",selectedChat,)    
    
      const [messagesMap, setMessagesMap] = useState({});
      const [pageNumberMessage, setPageNumberMessage] = useState(1);
      const pageSizeMessage = 30;
    
      const lastReceivedMessage = useRef(null);
    
      //  WebSocket hooks
      const {
        getIsconnection,
        onMessageReceived,
        onMessageStatusUpdated,
        updateMessageStatus,
        markAsRead: markAsReadViaWS,
      } = useSignalR();
    
    
      const {
        data: messagesData,
        isLoading: messagesLoading,
        isError: messagesIsError,
        refetch: refetchMessages,
      } = useGetChatMessagesQuery(
        {
          PersonId: 1,
          chatId: selectedChat,
          pageNumber: pageNumberMessage,
          pageSize: pageSizeMessage,
        },
      );
      const [sendMessageApi, { isLoading: isSending }] = useSendMessageMutation();
    

  useEffect(() => {
    if (messagesData?.data && selectedChat) {
      const chatIdStr = selectedChat.toString();

      setMessagesMap((prev) => ({
        ...prev,
        [chatIdStr]: messagesData.data,
      }));
    }
    console.log("messagesData", messagesData);
  }, [messagesData, selectedChat]);

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
      if (1 === message.chatId) {
        updateMessageStatus(1, message.messageId, 2);
      } else {
        updateMessageStatus(1, message.messageId, 1);
      }
      // ===== (RTK Query) =====
      dispatch(
        doctorChatApi.util.updateQueryData(
          "getChatMessages",
          {
            PersonId: 1,
            chatId: message.chatId,
            pageNumber: pageNumberMessage,
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

      message.id = message.messageId;
      message.isMine = false;
      lastReceivedMessage.current = message;


      if (selectedChat && parseInt(selectedChat) === message.chatId) {
        setMessagesMap((prev) => {
          const existingMessages = prev[chatIdStr] || [];
          if (
            !existingMessages.some((msg) => msg.messageId === message.messageId)
          ) {
            return {
              ...prev,
              [chatIdStr]: [message, ...existingMessages],
            };
          }
          return prev;
        });
      }
      console.log("messagesMap=", messagesMap);

      
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
                  pageNumber: pageNumberMessage,
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
      
            setMessagesMap((prev) => {
              const updated = { ...prev };
              const chatMessages = updated[chatIdStr];
      
              if (chatMessages) {
                return {
                  ...updated,
                  [chatIdStr]: chatMessages.map((msg) => {
                    if (statusUpdate.messageIds?.includes(msg.messageId)) {
                      return {
                        ...msg,
                        status: statusUpdate.status,
                        seenAt: statusUpdate.seenAt,
                        deliveredAt: statusUpdate.deliveredAt,
                      };
                    }
                    return msg;
                  }),
                };
              }
              return prev;
            });
      
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
            pageNumber: pageNumberMessage,
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
        setMessagesMap((prev) => {
          const existingMessages = prev[chatIdStr] || [];
          return {
            ...prev,
            [chatIdStr]: [...existingMessages, tempMessage],
          };
        });

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

          try {
            dispatch(
              doctorChatApi.util.updateQueryData(
                "getChatMessages",
                {
                  PersonId: 1,
                  chatId: selectedChat,
                  pageNumber: pageNumberMessage,
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
          } catch {}

          setMessagesMap((prev) => {
            const chatMessages = prev[chatIdStr] || [];
            return {
              ...prev,
              [chatIdStr]: chatMessages.map((msg) =>
                msg.messageId === tempMessage.messageId
                  ? { ...msg, ...result, status: "Sent" }
                  : msg
              ),
            };
          });
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
                pageNumber: pageNumberMessage,
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

        const chatIdStr = chatId.toString();
        setMessagesMap((prev) => {
          const chatMessages = prev[chatIdStr] || [];
          return {
            ...prev,
            [chatIdStr]: chatMessages.map((msg) =>
              msg.messageId?.startsWith("temp-") ? { ...msg, status: 3 } : msg
            ),
          };
        });

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
  
          setMessagesMap((prev) => {
            const chatMessages = prev[chatIdStr];
            if (chatMessages) {
              return {
                ...prev,
                [chatIdStr]: chatMessages.map((msg) => ({
                  ...msg,
                  status: msg.isMine ? msg.status : "Seen",
                  seenAt: msg.isMine ? msg.seenAt : new Date().toISOString(),
                })),
              };
            }
            return prev;
          });
  
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

      const currentMessages = selectedChat
    ? messagesMap[selectedChat.toString()] || []
    : [];
    console.log('selectedChat', selectedChat);

     return {

    messages: currentMessages,
    messagesLoading: selectedChat ? messagesLoading : false,
    messagesIsError: selectedChat ? messagesIsError : false,
    refetchMessages,

    sendMessage,
    isSending,

    markMessagesAsRead,

    // WebSocket
    lastMessage: lastReceivedMessage.current,
  };
}