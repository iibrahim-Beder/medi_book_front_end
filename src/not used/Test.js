import React, { useState, useEffect } from 'react';
import { audioService } from '../pages/notifications/audioService';

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
    </div>
  );
};

export default AudioPlayer;
