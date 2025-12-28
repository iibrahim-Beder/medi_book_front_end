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

  return (
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
    </div>
  );
};

export default AudioPlayer;