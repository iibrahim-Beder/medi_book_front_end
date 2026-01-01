import toast from "react-hot-toast";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { useEffect, useRef } from "react";
import { useDevice } from "../../../context/useIsMobile";
import { audioService } from "../../notifications/audioService";
import { useDispatch, useSelector } from "react-redux";
import ToastMessage from "../components/ToastMrssage";
import { useMessages } from "./useMessages";
import { doctorChatApi } from "../../../api/chat/doctorChatApi";
import { updateTyping } from "../slices/messagesSlice";
const MessageStatus = {
  Sent: 0,
  Delivered: 1,
  Read: 2,
  Failed: 3,
  Sending: 4,
};
export const useMessageListener = () => {
  const dispatch = useDispatch();
  const isChatOpen = useSelector((state) => state.chats.isChatOpen);  
  const selectedChat = useSelector((state) => state.chats.selectedChatId);
  const selectedChatRef = useRef(selectedChat);
const isChatOpenRef = useRef(isChatOpen);

useEffect(() => {
  selectedChatRef.current = selectedChat;
  isChatOpenRef.current = isChatOpen;
}, [selectedChat, isChatOpen]);
console.log("==isChatOpenRef.current", isChatOpenRef.current, "selectedChatRef.current", selectedChatRef.current);



  const {
    onMessageStatusUpdated,
    onMessageReceived,
    removeMessageHandler,
    isConnected,
    onUserStatusChanged,
    onUserTyping,
    updateMessageStatus,
    onMarkAllMessagesAsRead,
  } = useSignalR();
  const pageSizeMessage = 30;
  // const {pageSizeMessage}=useMessages();
  const { isMobile } = useDevice();
  const chatToastsRef = useRef({});
  
  useEffect(() => {
    if (!selectedChat) return;

    const toasts = chatToastsRef.current[selectedChat];

    if (toasts && toasts.length) {
      toasts.forEach((id) => toast.dismiss(id));
      chatToastsRef.current[selectedChat] = [];
    }
  }, [selectedChat, isChatOpen]);

  // new message received from WebSocket listener
  const handleNewMessage = (message) => {
    console.log("New message received from WebSocket:", message);
    if (selectedChatRef.current  === message.chatId && isChatOpenRef.current) {
      audioService.play("messageArrivedChatIn");
      updateMessageStatus(
        message.chatId,
        message.messageId,
        MessageStatus.Read
      );
    } else {
      updateMessageStatus(
        message.chatId,
        message.messageId,
        MessageStatus.Delivered
      );
      audioService.play("messageArrived");
      const toastId = toast.custom(
        (t) => <ToastMessage t={t} message={message} />,
        {
          duration: 600000,
          position: isMobile ? "top-right" : "bottom-right",
        }
      );

      if (!chatToastsRef.current[message.chatId]) {
        chatToastsRef.current[message.chatId] = [];
      }
      chatToastsRef.current[message.chatId].push(toastId);
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
              // message.senderId !== message.currentUserId &&
              selectedChatRef.current  !== message.chatId ||!isChatOpenRef.current
            ) {
              chat.unreadCount = (chat.unreadCount || 0) + 1;
              chat.isLastMessageRead = false;
            }
          }

          draft.data.sort(
            (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
          );
        }
      )
    );
  };
  useEffect(() => {
    if (isConnected) {
      onMessageReceived(handleNewMessage);
    }
    return () => {
      removeMessageHandler();
    };
  }, [isConnected]);
  // end

  // user status listener
  useEffect(() => {
    const handleUserStatusChange = (statusUpdate) => {
      // console.log('== chatsData', chatsData);
      console.log("== User status update from WebSocket:", statusUpdate);

      dispatch(
        doctorChatApi.util.updateQueryData(
          "getDoctorChats",
          undefined,
          (draft) => {
            if (!draft?.data) return;

            const chat = draft.data.find(
              (c) => c.chatId === statusUpdate.chatId
            );

            if (chat) {
              chat.isOnline = statusUpdate.isOnline;
              chat.lastSeen = statusUpdate.timestamp;
            }
          }
        )
      );
    };

    if (isConnected) {
      onUserStatusChanged(handleUserStatusChange);
    }
  }, [isConnected]);

  // user typing listener
  const handleUserTyping = (typingUpdate) => {
    if (typingUpdate.chatId === selectedChatRef.current  && isChatOpenRef.current) {
      audioService.play("writing");
    }
    dispatch(
      updateTyping({
        chatId: typingUpdate.chatId,
        userId: typingUpdate.userId,
        isTyping: typingUpdate.isTyping,
      })
    );
  };
  useEffect(() => {
    if (isConnected) {
      onUserTyping(handleUserTyping);
    }
  }, [isConnected]);
  // end
  // message status listener
  useEffect(() => {
    const handleMessageStatusUpdate = (statusUpdate) => {
      console.log("==Message status update from WebSocket :", statusUpdate);
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
  if(isConnected){
    onMessageStatusUpdated(handleMessageStatusUpdate);
  }
  }, [isConnected]);
// end
// mark all Messages As Read listener
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
                msg.status = MessageStatus.Read;
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
                chat.lastMessageStatus =MessageStatus.Read;
              }
            }
          )
        );

    };
    if (isConnected)  {
      onMarkAllMessagesAsRead(handleMessageMarkfromlastmessageasread);
    }

  }, [isConnected, onMarkAllMessagesAsRead]);
// end
  
};
