class AudioService {
  constructor() {
    this.audios = {}; // Store different audio objects
    this.isMuted = false;
    this.sounds = {}; // Store sound configuration
  }

  init(soundsConfig = {}) {
    // You can pass sound configuration during initialization
    // Example: { notification: '/notification.mp3', alert: '/alert.mp3', bell: '/bell.mp3' }
    this.sounds = soundsConfig;
    
    // Load all sounds
    Object.entries(this.sounds).forEach(([name, url]) => {
      this.audios[name] = new Audio(url);
      this.audios[name].preload = 'auto';
      this.audios[name].volume = 1.0;
    });
  }

  // Add a new sound dynamically
  addSound(name, url) {
    if (!this.audios[name]) {
      this.audios[name] = new Audio(url);
      this.audios[name].preload = 'auto';
      this.audios[name].volume = 1.0;
      return true;
    }
    return false;
  }

  // Play a specific sound
  play(soundName) {
    if (this.isMuted || !this.audios[soundName]) return false;
    
    try {
      this.audios[soundName].currentTime = 0;
      this.audios[soundName].play().catch(e => {
        console.log(`Audio ${soundName} play failed:`, e);
      });
      return true;
    } catch (error) {
      console.error(`Audio ${soundName} error:`, error);
      return false;
    }
  }

  // Play a sound with looping
  playLoop(soundName, loop = true) {
    if (this.isMuted || !this.audios[soundName]) return false;
    
    try {
      this.audios[soundName].currentTime = 0;
      this.audios[soundName].loop = loop;
      this.audios[soundName].play().catch(e => {
        console.log(`Audio ${soundName} loop play failed:`, e);
      });
      return true;
    } catch (error) {
      console.error(`Audio ${soundName} loop error:`, error);
      return false;
    }
  }

  // Stop a specific sound
  stop(soundName) {
    if (this.audios[soundName]) {
      this.audios[soundName].pause();
      this.audios[soundName].currentTime = 0;
      this.audios[soundName].loop = false;
      return true;
    }
    return false;
  }

  // Stop all sounds
  stopAll() {
    Object.keys(this.audios).forEach(soundName => {
      this.stop(soundName);
    });
  }

  // Control volume for a specific sound
  setVolume(soundName, volume) {
    if (this.audios[soundName] && volume >= 0 && volume <= 1) {
      this.audios[soundName].volume = volume;
      return true;
    }
    return false;
  }

  // Get volume level of a specific sound
  getVolume(soundName) {
    return this.audios[soundName] ? this.audios[soundName].volume : 0;
  }

  setMuted(muted) {
    this.isMuted = muted;
    // You can also stop all sounds when muting
    if (muted) {
      this.stopAll();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
<<<<<<< HEAD
    return this.isMuted;
  }
=======
    if (this.isMuted) {
      this.stopAll();
    }
    return this.isMuted;
  }

  // Check if a sound exists
  hasSound(soundName) {
    return !!this.audios[soundName];
  }

  // Get a list of available sounds
  getAvailableSounds() {
    return Object.keys(this.audios);
  }

  // Remove a sound from memory
  removeSound(soundName) {
    if (this.audios[soundName]) {
      this.stop(soundName);
      delete this.audios[soundName];
      return true;
    }
    return false;
  }
>>>>>>> Messages-ui
}

export const audioService = new AudioService();