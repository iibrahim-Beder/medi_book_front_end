import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  useGetDoctorChatsQuery, 
} from '../../../api/chat/doctorChatApi';
import { useSignalR } from '../../../api/chat/chatUseSignalR';
import {doctorChatApi} from '../../../api/chat/doctorChatApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from '../slices/chatsSlice';
import { selectIsChatTyping, updateTyping } from '../slices/messagesSlice';
import { audioService } from '../../notifications/audioService';
export const useConversations = () => {
  const dispatch = useDispatch();

  const selectedChat = useSelector((state) => state.chats.selectedChatId);
  
  const changeChat = useCallback((chatId) => dispatch(selectChat(chatId)), [dispatch]);  

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);


  const pageSize = 10;

  const lastReceivedMessage = useRef(null);

  //  WebSocket hooks
  const {
    isConnected,
    onUserStatusChanged,
    onUserTyping,
  } = useSignalR();

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
  // console.log("chatsData",chatsData);
  // console.log("isLoading",isLoading);

    useEffect(() => {
    const handleUserTyping = (typingUpdate) => {  
         dispatch(updateTyping({chatId:typingUpdate.chatId,userId: typingUpdate.userId,isTyping: typingUpdate.isTyping,}));
    if(typingUpdate.chatId===selectedChat){
      audioService.play('writing')}
    };
    onUserTyping(handleUserTyping);
  }, [onUserTyping, isConnected,selectedChat]);

  useEffect(() => {
    const handleUserStatusChange = (statusUpdate) => {
      // console.log('== chatsData', chatsData);
      // console.log('== User status update:', statusUpdate);

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

    // if (connection) {
    onUserStatusChanged(handleUserStatusChange);
    // }
  }, [isConnected, onUserStatusChanged, chatsData]);


  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPageNumber(1);
  }, []);


  // typing
  const isChatTyping = useSelector(selectIsChatTyping(selectedChat));

  // lad more chats
  const loadMore = useCallback(() => {
    if (chatsData?.totalPages > pageNumber) {
      setPageNumber((prev) => prev + 1);
    }
  }, [chatsData?.totalPages, pageNumber]);


    console.log('selectedChat', selectedChat);
 
  const conversations = chatsData?.data ?? [];

  const currentChat = selectedChat
    ? conversations.find(c => c.chatId === selectedChat)
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
    hasNextPage: chatsData?.hasNextPage,
    // chat selection
    selectedChat,
    changeChat,
    // WebSocket
    isChatTyping,
    connection: isConnected,
    lastMessage: lastReceivedMessage.current,
  };
};