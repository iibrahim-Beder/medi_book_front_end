class AudioService {
  constructor() {
    this.audio = null;
    this.isMuted = false;
  }

  init() {
    this.audio = new Audio('/notification.mp3');
    this.audio.preload = 'auto';
  }

  play() {
    if (this.isMuted || !this.audio) return;
    
    try {
      this.audio.currentTime = 0;
      this.audio.play().catch(e => {
        console.log('Audio play failed:', e);
      });
    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const audioService = new AudioService();