import { useState, useEffect, useCallback, useRef } from "react";
import { useGetDoctorChatsQuery } from "../../../api/chat/doctorChatApi";
import { useDispatch, useSelector } from "react-redux";
import { selectChat, setIsChatOpen } from "../slices/chatsSlice";
import { selectIsChatTyping } from "../slices/messagesSlice";
import { useNavigate } from "react-router-dom";
export const useConversations = () => {
  const dispatch = useDispatch();

  const selectedChat = useSelector((state) => state.chats.selectedChatId);
  const isChatOpen = useSelector((state) => state.chats.isChatOpen);  

  const navigate = useNavigate();

  const setIsChatComponentOpen = useCallback(
    (bool) => dispatch(setIsChatOpen(bool)),
    [dispatch],
  );


  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 10;

  // chats
  const {
    data: chatsData,
    isLoading,
    isError,
    refetch: refetchConversations,
  } = useGetDoctorChatsQuery({
    pageNumber,
    pageSize,
  });
  console.log("chatsData", chatsData);
  useEffect(() => {
    if (
      window.innerWidth >= 992 &&
      !isLoading &&
      chatsData?.data?.length > 0 &&
      selectedChat) {
        navigate(`/chat/${selectedChat}`);
    }
    
    if (
      window.innerWidth >= 992 &&
      !isLoading &&
      chatsData?.data?.length > 0 &&
      !selectedChat
    ) {
      const firstId = chatsData.data[0]?.chatId;
        navigate(`/chat/${firstId}`);
    }
  }, [isLoading, chatsData, selectedChat,isChatOpen]);
  // console.log("isLoading",isLoading);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPageNumber(1);
  }, []);

  // typing
  const isChatTyping = useSelector(selectIsChatTyping(selectedChat));

  // load more chats
  const loadMore = useCallback(() => {
    if (chatsData?.totalPages > pageNumber) {
      setPageNumber((prev) => prev + 1);
    }
  }, [chatsData?.totalPages, pageNumber]);
 
  const conversations = chatsData?.data ?? [];

  const currentChat = selectedChat
    ? conversations.find((c) => c.chatId === selectedChat)
    : null;
  return {
    conversations,
    currentChat,
    isLoading,
    isError,
    isSearching: isLoading && pageNumber === 1,
    searchTerm,
    handleSearch,
    setSearchTerm,
    loadMore,
    refetch: refetchConversations,
    hasNextPage: chatsData?.hasNextPage ?? false,
    // chat selection
    selectedChat,
    // WebSocket
    isChatTyping,
    setIsChatOpen: setIsChatComponentOpen,
  };
};
