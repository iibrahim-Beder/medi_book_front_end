import React, { useState, useEffect } from 'react';
import { audioService } from '../pages/notifications/audioService';

const soundsConfig = {
  notification: '/sounds/notification.mp3',
  messageArrived: '/sounds/message-arrives.wav',
  sendMessage: '/sounds/Send-message.wav',
  writing: '/sounds/writing.mp3'
};

audioService.init(soundsConfig);

const playNotificationSound = () => {
  audioService.play('notification');
};

const playSendMessage = () => {
  audioService.play('sendMessage');
};


const AudioPlayer = () => {
  const [isMuted, setIsMuted] = useState(audioService.isMuted);

  useEffect(() => {
    // Initialize audio service when component mounts
    audioService.init();
  }, []);

  const toggleMute = () => {
    const newMutedState = audioService.toggleMute();
    setIsMuted(newMutedState);
  };

  const playAudio = () => {
    audioService.play();
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
<<<<<<< HEAD
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
=======
    <div>
      <button onClick={playAudio}>Play Audio</button>
      <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
<button onClick={playNotificationSound}>play Notification Sound</button>
<button onClick={playSendMessage}>play send message Sounded</button>
<button onClick={() => audioService.play('messageArrived')}>play message-arrives sound  </button>
<button onClick={() => audioService.play('writing')}>play  writing sound </button>
<button onClick={() => audioService.toggleMute()}>
  {audioService.isMuted ? 'unmute' : 'mute'}
  </button>
>>>>>>> Messages-ui
    </div>
  );
};

<<<<<<< HEAD
export default ChatContainer;
=======
export default AudioPlayer;
>>>>>>> Messages-ui
