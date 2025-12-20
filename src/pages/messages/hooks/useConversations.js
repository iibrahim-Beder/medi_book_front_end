import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  useGetDoctorChatsQuery, 
} from '../../../api/chat/doctorChatApi';
import { useSignalR } from '../../../api/chat/chatUseSignalR';
import {doctorChatApi} from '../../../api/chat/doctorChatApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from '../slices/chatsSlice';
export const useConversations = () => {
  const dispatch = useDispatch();

  const selectedChat = useSelector((state) => state.chats.selectedChatId);
  
  
  const changeChat = useCallback((chatId) => dispatch(selectChat(chatId)), [dispatch]);  

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [conversationsMap, setConversationsMap] = useState({});
  const [Typing, setTyping] = useState(false);


  const pageSize = 10;

  const lastReceivedMessage = useRef(null);

  //  WebSocket hooks
  const {
    getIsconnection,
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

    useEffect(() => {
    const handleUserTyping = (typingUpdate) => {
      console.log("==User typing update from WebSocket :", typingUpdate);
      setTyping(typingUpdate);
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
          {
            pageNumber: 1,
            pageSize: 10,
          },
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

      setConversationsMap((prev) => {
        const updated = { ...prev };
        const chatIdStr = statusUpdate.chatId.toString();

        if (updated[chatIdStr]) {
          updated[chatIdStr] = {
            ...updated[chatIdStr],
            isOnline: statusUpdate.isOnline,
            lastSeen: statusUpdate.isOnline ? null : statusUpdate.lastSeen,
            lastActivity: statusUpdate.lastActivity,
          };
        }

        return updated;
      });
    };

    // if (connection) {
    onUserStatusChanged(handleUserStatusChange);
    // }
  }, [getIsconnection, onUserStatusChanged, chatsData]);

  useEffect(() => {
    if (chatsData?.data) {
      setConversationsMap((prev) => {
        const newMap = { ...prev };

        chatsData.data.forEach((chat) => {
          const chatKey = chat.chatId.toString();

          if (newMap[chatKey]) {
            newMap[chatKey] = {
              ...chat,
              ...newMap[chatKey],
             
              lastMessage:
                newMap[chatKey].lastMessageTime > chat.lastMessageTime
                  ? newMap[chatKey].lastMessage
                  : chat.lastMessage,
              lastMessageTime: Math.max(
                new Date(newMap[chatKey].lastMessageTime || 0).getTime(),
                new Date(chat.lastMessageTime || 0).getTime()
              ),
            };
          } else {
            newMap[chatKey] = chat;
          }
        });

        return newMap;
      });
    }
  }, [chatsData]);


  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPageNumber(1);
  }, []);


  // typing

  // lad more chats
  const loadMore = useCallback(() => {
    if (chatsData?.totalPages > pageNumber) {
      setPageNumber((prev) => prev + 1);
    }
  }, [chatsData?.totalPages, pageNumber]);


    console.log('selectedChat', selectedChat);
  const currentChat = selectedChat
    ? conversationsMap[selectedChat.toString()]
    : null;


    console.log('conversationsMap', conversationsMap);
  return {
    setConversationsMap,
    conversations: Object.values(conversationsMap),

    currentChat,

    isLoading,
    isError,
    isSearching: isLoading && pageNumber === 1,


    searchTerm,
    handleSearch,
    setSearchTerm,


    loadMore,
    refetch: refetchConversations,

    // chat selection
    selectedChat,
    changeChat,

    // WebSocket
    Typing,
    connection: getIsconnection,
    lastMessage: lastReceivedMessage.current,
  };
};