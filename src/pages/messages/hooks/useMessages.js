import { useState, useEffect, useCallback, useRef } from "react";
import {
  useGetChatMessagesQuery,
  useSendMessageMutation,
} from "../../../api/chat/doctorChatApi";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { doctorChatApi } from "../../../api/chat/doctorChatApi";
import { useDispatch, useSelector } from "react-redux";
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

  const currentPage = pageByChat[selectedChat] ?? 1;

  const pageSizeMessage = 30;

  const lastReceivedMessage = useRef(null);

  //  WebSocket hooks
  const {
    isConnected,
    InvokeMarkFromLastMessagesAsRead,
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
    if(!messagesData.hasNextPage||isFetching)return
    console.log("==loadMore hasNextPage", messagesData.hasNextPage) ;
    setPageByChat((prev) => ({
      ...prev,
      [selectedChat]: (prev[selectedChat] ?? 1) + 1,
    }));
  };

  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;

    if (Math.abs(el.scrollTop) + el.clientHeight >= el.scrollHeight - 15) {
      loadMore();
    }
  };

  console.log("===render===");


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
                chat.isLastMessageRead = true;
              }
            }
          )
        );}
  // in selectedChat change
const lastMarkedMessageIdRef = useRef(null);

useEffect(() => {
   if (!isConnected) return;

 const maxMessageId = currentMessages?.length
  ? Math.max(...currentMessages.map(msg => msg.id))
  : undefined;

  if (
    (selectedChat !== -1 ||selectedChat ===null) &&
    currentMessages?.length > 0 &&
    maxMessageId &&
    lastMarkedMessageIdRef.current !== maxMessageId
  ) {
    lastMarkedMessageIdRef.current = maxMessageId;

    InvokeMarkFromLastMessagesAsRead(selectedChat, maxMessageId);
    markMessagesAsRead();
  }
}, [selectedChat, messagesLoading, isConnected,markMessagesAsRead,InvokeMarkFromLastMessagesAsRead]);

useEffect(() => {
 setPageByChat((prev) => ({
    ...prev,
    [selectedChat]: 1,
  }));

  toLatestMessage();
}, [selectedChat]);
  
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
              chat.lastMessageStatus = MessageStatus.Sending || 4;

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
                    msg.isDelivered = result.data.isDelivered;
                  }
                });
              }
            )
          );
        }
          audioService.play('sendMessage');
        // return result;
      } catch (error) {
        console.error("Error sending message:", error);
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
                    msg.status = MessageStatus.Failed;
                  }
                });
              }
            )
          );
        
        // throw error;
      }
    },

    [selectedChat, sendMessageApi]
  );

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
               audioService.play('sendMessage');
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


  return {
    messages: currentMessages,
    pageSizeMessage,
    messagesLoading: selectedChat ? messagesLoading : false,
    messagesIsError: selectedChat ? messagesIsError : false,
    refetchMessages,
    isLoadingOlderMessages :isFetching&&pageByChat[selectedChat]>1,
    isLoadingNewerMessages :isFetching&&pageByChat[selectedChat]===1,
    sendMessage,
    resendMessage,
    isSending,
    handleScroll,
    chatContainerRef,
    toLatestMessage,
    // WebSocket
    lastMessage: lastReceivedMessage.current,
  };
};
