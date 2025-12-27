import { useEffect, useRef } from "react";
import { signalRService } from "../../../api/chat/ChatSignalRService";
import { useSelector } from "react-redux";

const TYPING_TIMEOUT = 2000; // 2 seconds

export function useTypingIndicator({
  message,
  updateUserTyping,
}) {
    const chatId = useSelector((state) => state.chats.selectedChatId);

  const isTypingRef = useRef(false);
  const typingTimerRef = useRef(null);

  const startTyping = () => {
    if (isTypingRef.current) return;
    if (signalRService.connection?.state === "Connecting") return;

    isTypingRef.current = true;
    updateUserTyping(chatId, true);
  };

  const stopTyping = () => {
    if (!isTypingRef.current) return;
    if (signalRService.connection?.state === "Connecting") return;

    isTypingRef.current = false;
    updateUserTyping(chatId, false);
  };

  const restartTypingTimer = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      stopTyping();
    }, TYPING_TIMEOUT);
  };

  // to check if the user is typing
  useEffect(() => {
    if (message.trim()) {
      startTyping();
      restartTypingTimer();
    } else {
      stopTyping();
    }

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [message]);

  // to stop the typing indicator
  const onMessageSent = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    stopTyping();
  };

  const onInputBlur = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    stopTyping();
  };

  return {
    onMessageSent,
    onInputBlur,
  };
}
