/**
 * AUDIO ENGINE FOR HOMER'S WEB PAGE
 * Season 12 Episode 6: "The Computer Wore Menace Shoes"
 * 
 * Generates retro 90s sound effects and cheesy MIDI music using Web Audio API.
 * No external sound files required!
 */

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.chaosInterval = null;
    this.musicTimer = null;
    this.musicStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Police / Emergency Siren
  playSiren() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(1100, now + 0.4);
    osc.frequency.linearRampToValueAtTime(600, now + 0.8);
    osc.frequency.linearRampToValueAtTime(1100, now + 1.2);
    osc.frequency.linearRampToValueAtTime(600, now + 1.6);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 1.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.7);
  }

  // 2. Church / Cathedral Bell
  playBell() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const freqs = [440, 880, 1320, 1760]; // Harmonics

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      const amp = 0.15 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 2.2);
    });
  }

  // 3. Spring Boing
  playBoing() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  // 4. Slide Whistle / Cartoon Fall
  playWhistle() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.8);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.85);
  }

  // 5. Toilet Flush / White Noise Gush
  playFlush() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 1.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 1.45);
  }

  // 6. Homer "D'OH!" synth
  playDoh() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.28);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 7. Duff Beer Burp
  playBurp() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.4);
    osc.frequency.linearRampToValueAtTime(90, now + 0.6);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
  }

  // 8. Cheer Fanfare
  playCheer() {
    if (this.isMuted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + (idx * 0.1);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  // 9. Retro Cheesy MIDI Background Loop
  startCheesyMidiLoop() {
    if (this.musicTimer) return;
    const melody = [
      261.63, 329.63, 392.00, 523.25,
      392.00, 329.63, 261.63, 196.00,
      220.00, 277.18, 329.63, 440.00,
      392.00, 349.23, 329.63, 293.66
    ];

    this.musicTimer = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const freq = melody[this.musicStep % melody.length];
      this.musicStep++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }, 200);
  }

  stopCheesyMidiLoop() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // 10. HOMER'S QUOTE SPEECH SYNTHESIS
  speakHomerQuote() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = "¡Lisa! Creerías que todos estos ruidos serían molestos... ¡pero no!";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.85; // Low-pitched Homer voice
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    } else {
      this.playDoh();
    }
  }

  // 11. HOMER'S ICONIC NOISE CHAOS (Plays random effects intermittently)
  startNoiseChaos() {
    this.isMuted = false;
    this.init();
    this.startCheesyMidiLoop();

    // Play immediate welcoming burst
    this.playSiren();
    setTimeout(() => this.playBell(), 400);
    setTimeout(() => this.playBoing(), 800);

    // Chaos interval: triggers random noises every 2 to 4 seconds
    if (!this.chaosInterval) {
      this.chaosInterval = setInterval(() => {
        if (this.isMuted) return;
        const soundPool = ['siren', 'bell', 'boing', 'whistle', 'flush', 'doh', 'burp'];
        const chosen = soundPool[Math.floor(Math.random() * soundPool.length)];
        this.playSoundByName(chosen);
      }, 3000);
    }
  }

  stopNoiseChaos() {
    this.isMuted = true;
    this.stopCheesyMidiLoop();
    if (this.chaosInterval) {
      clearInterval(this.chaosInterval);
      this.chaosInterval = null;
    }
  }

  toggleSound() {
    if (this.isMuted) {
      this.startNoiseChaos();
      return true; // Now unmuted
    } else {
      this.stopNoiseChaos();
      return false; // Now muted
    }
  }

  playSoundByName(name) {
    if (this.isMuted) {
      // Temporarily enable audio context on explicit user clicks
      this.init();
      const prevMute = this.isMuted;
      this.isMuted = false;
      this._dispatchSound(name);
      this.isMuted = prevMute;
    } else {
      this._dispatchSound(name);
    }
  }

  _dispatchSound(name) {
    switch(name) {
      case 'siren': this.playSiren(); break;
      case 'bell': this.playBell(); break;
      case 'boing': this.playBoing(); break;
      case 'whistle': this.playWhistle(); break;
      case 'flush': this.playFlush(); break;
      case 'doh': this.playDoh(); break;
      case 'burp': this.playBurp(); break;
      case 'cheer': this.playCheer(); break;
      default: this.playBoing(); break;
    }
  }
}

// Global instance
window.retroAudio = new RetroAudioEngine();
