// hooks/useSyncChatWithUrl.js

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectChat } from "../slices/chatsSlice";
import { useConversations } from "./useConversations";

export const useSyncChatWithUrl = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const { setIsChatOpen } = useConversations();
  const isChatOpen = useSelector((state) => state.chats.isChatOpen);

  useEffect(() => {
    if (!chatId) {
      document.documentElement.setAttribute("isConversationOpen", "false");
      setIsChatOpen(false);
      dispatch(selectChat(null));
      return;
    }
    const id = Number(chatId);
    document.documentElement.setAttribute("isConversationOpen", "true");
    setIsChatOpen(true);

    if (id) {
      dispatch(selectChat(id));
    }
  }, [chatId, dispatch, isChatOpen]);
};
