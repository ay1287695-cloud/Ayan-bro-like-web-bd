/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    // Lazy initialisation to comply with browser autoplay policies
  }

  private init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
  }

  toggle(state?: boolean) {
    this.enabled = state !== undefined ? state : !this.enabled;
    if (this.enabled) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const playNote = (freq: number, start: number, duration: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    // Arpeggio
    playNote(523.25, now, 0.15); // C5
    playNote(659.25, now + 0.08, 0.15); // E5
    playNote(783.99, now + 0.16, 0.15); // G5
    playNote(1046.50, now + 0.24, 0.3); // C6
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    // Apply lowpass filter to make it sound muffled/cyberpunk
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  playBeep(frequency: number = 900, duration: number = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration + 0.01);
  }

  playCharge() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 1.5);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 1.5);
  }

  private activeOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private _sweepInterval: any = null;

  startInjectionSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    this.stopInjectionSound();

    try {
      const now = this.ctx.currentTime;
      
      // Cyber hum generator
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(85, now);
      osc1.frequency.linearRampToValueAtTime(130, now + 8);

      const filter1 = this.ctx.createBiquadFilter();
      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(220, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.06, now + 0.3);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(this.ctx.destination);

      // Oscillating pitch sound representing cyber-scanning
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(240, now);

      let step = 0;
      this._sweepInterval = setInterval(() => {
        if (!this.ctx) return;
        try {
          const time = this.ctx.currentTime;
          step += 1;
          const currentFreq = 240 + Math.sin(step * 0.4) * 90;
          osc2.frequency.setValueAtTime(currentFreq, time);
        } catch (e) {}
      }, 40);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.03, now + 0.5);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      this.activeOscs.push({ osc: osc1, gain: gain1 });
      this.activeOscs.push({ osc: osc2, gain: gain2 });
    } catch (e) {
      console.error('Audio scan start failed:', e);
    }
  }

  stopInjectionSound() {
    if (this._sweepInterval) {
      clearInterval(this._sweepInterval);
      this._sweepInterval = null;
    }
    
    this.activeOscs.forEach(({ osc, gain }) => {
      try {
        if (this.ctx) {
          gain.gain.cancelScheduledValues(this.ctx.currentTime);
          gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
          setTimeout(() => {
            try { osc.stop(); } catch (e) {}
          }, 300);
        } else {
          osc.stop();
        }
      } catch (e) {}
    });
    this.activeOscs = [];
  }

  playWelcomeVoice() {
    if (!this.enabled) return;
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      
      synth.cancel();

      // Clear Bengali message welcoming Ayan to the premium likes website
      const utterance = new SpeechSynthesisUtterance("স্বাগতম অয়ন লাইক ওয়েবসাইটে! উপভোগ করুন আপনার ফ্রি ফায়ার ভিআইপি লাইক সার্ভিস।");
      utterance.lang = "bn-BD";
      
      // Retrieve voices and pair with a clean female voice profile
      const voices = synth.getVoices();
      
      const bnFemaleVoice = voices.find(v => v.lang.includes('bn') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')));
      if (bnFemaleVoice) {
        utterance.voice = bnFemaleVoice;
      } else {
        const bnVoice = voices.find(v => v.lang.includes('bn'));
        if (bnVoice) {
          utterance.voice = bnVoice;
        } else {
          // Fallback message in English if Bengali text-to-speech engine is not active
          utterance.text = "Welcome to Ayan's Free Fire VIP Hub! Enjoy your premium likes service.";
          utterance.lang = "en-US";
          const enFemaleVoice = voices.find(v => v.lang.includes('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')));
          if (enFemaleVoice) {
            utterance.voice = enFemaleVoice;
          }
        }
      }
      
      utterance.rate = 0.95;
      utterance.pitch = 1.15; // Slightly higher pitch for a sweet female tone
      utterance.volume = 1.0;
      
      synth.speak(utterance);
    } catch (e) {
      console.warn('Welcome speech synthesis blocked or failed:', e);
    }
  }
}

export const sfx = new SoundEffects();
