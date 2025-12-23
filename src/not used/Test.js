import React, { useState, useEffect, useCallback } from 'react';
import { useSignalR } from '../api/chat/chatUseSignalR';
import { useGetDoctorChatsQuery, useSendMessageMutation } from '../api/chat/doctorChatApi';
import { signalRService } from '../api/chat/ChatSignalRService';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selectChat } from '../pages/messages/slices/chatsSlice';
const ChatContainer = ({ userId=1 }) => {
  const dispatch = useDispatch()
  

const selectedChatId = useSelector(
  (state) => state.chats.selectedChatId
);
console.log("selectedChatId",selectedChatId,)


  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
      console.log('SignalR Connection State:', signalRService.connection ? signalRService.connection.state : 'Disconnected');


  const {
    onMessageReceived,
    onMessageStatusUpdated,
    getConnectionState,
    updateMessageStatus
  } = useSignalR(userId);
  const [sendMessagehook] = useSendMessageMutation();


  const { data: chatsData, refetch: refetchChats } = useGetDoctorChatsQuery({
    pageNumber: 1,
    pageSize: 10
  });

  useEffect(() => {
    onMessageReceived((newMessage) => {
      console.log('New message in component:', newMessage);
      
      refetchChats();
      
      setMessages(prev => [...prev, newMessage]);
    });
  }, [onMessageReceived, refetchChats]);

  useEffect(() => {
    onMessageStatusUpdated((statusUpdate) => {
      console.log('Message status update:', statusUpdate);
      
      setMessages(prev => prev.map(msg => 
        msg.messageId === statusUpdate.messageId 
          ? { ...msg, status: statusUpdate.status }
          : msg
      ));
    });
  }, [onMessageStatusUpdated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(getConnectionState());
    }, 5000);

    return () => clearInterval(interval);
  }, [getConnectionState]);

  const handleSendMessage = async (content, chatId, receiverId) => {


dispatch(selectChat(content));



    const messageData = {
      chatId :1,
      senderId: 1,
      content: content,
      sentAt: new Date().toISOString()
    };
    

    try {
      await sendMessagehook(messageData);
      
      refetchChats();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const markAsRead = async (messageId, chatId) => {
    const statusData = {
      messageId,
      chatId,
      status: 'Seen',
      updatedAt: new Date().toISOString()
    };

    try {
      await updateMessageStatus(statusData);
    } catch (error) {
      console.error('Failed to update message status:', error);
    }
  };

  const [content, setContent] = useState('');
  const [chatId, setChatId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  return (
    <div className="chat-container">
        
        <input
          type="text"
          placeholder="Enter message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={() => handleSendMessage(content, chatId, receiverId)}>Send</button>




      <div className="connection-status">
        Status: {connectionStatus}
      </div>
      
      <div className="chats-list">
        {chatsData?.data?.map(chat => (
          <div key={chat.chatId} className="chat-item">
            <div className="chat-header">
              <span className="patient-name">{chat.patientName}</span>
              {chat.unreadCount > 0 && (
                <span className="unread-badge">{chat.unreadCount}</span>
              )}
            </div>
            <div className="last-message">
              {chat.lastMessage}
              <span className="message-time">{chat.relativeTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatContainer;