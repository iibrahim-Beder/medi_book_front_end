import toast from "react-hot-toast";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { useEffect, useRef } from "react";
import { useDevice } from "../../../context/useIsMobile";
import { audioService } from "../../notifications/audioService";
import { useDispatch, useSelector } from "react-redux";
import ToastMessage from "../components/ToastMrssage";
import { useMessages } from "./useMessages";
import {doctorChatApi} from '../../../api/chat/doctorChatApi';
import { updateTyping } from "../slices/messagesSlice";

export  const useMessageListener = () => {
    const dispatch = useDispatch();
  const isChatOpen   = useSelector((state) => state.chats.isChatOpen);
  const { onMessageReceived, isConnected,onUserStatusChanged,onUserTyping } = useSignalR();
  const {isSending}=useMessages();
  const { isMobile } = useDevice();
  const chatToastsRef = useRef({});
  const selectedChat = useSelector((state) => state.chats.selectedChatId);
  console.log("selectedChat",selectedChat||-1)
  useEffect(() => {
    if (!selectedChat) return;

    const toasts = chatToastsRef.current[selectedChat];

    if (toasts && toasts.length) {
      toasts.forEach((id) => toast.dismiss(id));
      chatToastsRef.current[selectedChat] = [];
    }
  }, [selectedChat,isChatOpen]);

  useEffect(() => {
    const handleNewMessage = (message) => {
        console.log("New message received from useMessageListener WebSocket:", message);
      if (message.chatId === selectedChat && isChatOpen) return;

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
    };

    if (isConnected) {
      onMessageReceived(handleNewMessage);
    }
  }, [onMessageReceived, selectedChat, isConnected, isChatOpen]);


  // user status listener
   useEffect(() => {
      const handleUserStatusChange = (statusUpdate) => {
        // console.log('== chatsData', chatsData);
        console.log('== User status update from WebSocket:', statusUpdate);
  
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
    }, [isConnected, onUserStatusChanged]);
    
    // user typing listener
       useEffect(() => {
        const handleUserTyping = (typingUpdate) => {  
          if(typingUpdate.chatId === selectedChat && isChatOpen){audioService.play('writing')}
          dispatch(updateTyping({chatId:typingUpdate.chatId,userId: typingUpdate.userId,isTyping: typingUpdate.isTyping,}));
        };
        if (isConnected) {
          onUserTyping(handleUserTyping);
        };
    
      }, [onUserTyping, isConnected,selectedChat,isChatOpen]);



};
