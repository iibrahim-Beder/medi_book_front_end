import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  useGetDoctorChatsQuery, 
} from '../../../api/chat/doctorChatApi';
<<<<<<< HEAD
import { useSignalR } from '../../../api/chat/chatUseSignalR';
import {doctorChatApi} from '../../../api/chat/doctorChatApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from '../slices/chatsSlice';
import { selectIsChatTyping, updateTyping } from '../slices/messagesSlice';
=======
import { useDispatch, useSelector } from 'react-redux';
import { selectChat,setIsChatOpen } from '../slices/chatsSlice';
import { selectIsChatTyping } from '../slices/messagesSlice';
>>>>>>> Messages-ui
export const useConversations = () => {
  const dispatch = useDispatch();

  const selectedChat = useSelector((state) => state.chats.selectedChatId);
  
<<<<<<< HEAD
  
  const changeChat = useCallback((chatId) => dispatch(selectChat(chatId)), [dispatch]);  
=======
  const changeChat = useCallback((chatId) => dispatch(selectChat(chatId)), [dispatch]);  
  const setIsChatComponentOpen = useCallback((bool) => dispatch(setIsChatOpen(bool)), [dispatch]);  
>>>>>>> Messages-ui

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);


  const pageSize = 10;

<<<<<<< HEAD
  const lastReceivedMessage = useRef(null);

  //  WebSocket hooks
  const {
    getIsconnection,
    onUserStatusChanged,
    onUserTyping,
  } = useSignalR();

=======
>>>>>>> Messages-ui
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
<<<<<<< HEAD

    useEffect(() => {
    const handleUserTyping = (typingUpdate) => {
      dispatch(updateTyping({chatId:typingUpdate.chatId,userId: typingUpdate.userId,isTyping: typingUpdate.isTyping,}));
    };
    onUserTyping(handleUserTyping);
  }, [onUserTyping, getIsconnection]);

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
  }, [getIsconnection, onUserStatusChanged, chatsData]);
=======
  console.log("chatsData",chatsData);
  useEffect(() => {
    if(window.innerWidth >= 992&&!isLoading && chatsData?.data?.length>0 && !selectedChat){
  changeChat(chatsData.data[0]?.chatId);
  }
    
  },[isLoading])
  // console.log("isLoading",isLoading);

>>>>>>> Messages-ui


  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPageNumber(1);
  }, []);

<<<<<<< HEAD

  // typing
  const isChatTyping = useSelector(selectIsChatTyping(selectedChat));

  // lad more chats
=======
  // typing
  const isChatTyping = useSelector(selectIsChatTyping(selectedChat));

  // load more chats
>>>>>>> Messages-ui
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
<<<<<<< HEAD
=======
    hasNextPage: chatsData?.hasNextPage,
>>>>>>> Messages-ui
    // chat selection
    selectedChat,
    changeChat,
    // WebSocket
    isChatTyping,
<<<<<<< HEAD
    connection: getIsconnection,
    lastMessage: lastReceivedMessage.current,
=======
    setIsChatOpen:setIsChatComponentOpen
>>>>>>> Messages-ui
  };
};