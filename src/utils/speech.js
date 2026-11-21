/**
 * Browser SpeechSynthesis wrapper for CareLoop
 * Provides accessible, slow, and clear voice guidance in Hindi and English.
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.voices = [];
    this.listeners = new Set();

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getBestVoice(lang = 'en') {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    const isHindi = lang.startsWith('hi');

    if (isHindi) {
      const hiVoice = this.voices.find(
        (v) => v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
      );
      if (hiVoice) return hiVoice;
    }

    // English (prefer Indian English or natural voice)
    const enInVoice = this.voices.find((v) => v.lang === 'en-IN');
    if (enInVoice) return enInVoice;

    const enVoice = this.voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.default)
    );
    if (enVoice) return enVoice;

    return this.voices[0] || null;
  }

  notify(speaking, text = '') {
    this.listeners.forEach((cb) => cb({ speaking, text }));
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  speak(text, lang = 'en', onComplete = null) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      onComplete?.();
      return;
    }

    this.stop();

    if (!text || text.trim() === '') {
      onComplete?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoice(lang);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang.startsWith('hi') ? 'hi-IN' : 'en-US';
    }

    // Slightly slower rate for elderly clarity
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.notify(true, text);
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.notify(false, '');
      onComplete?.();
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis error:', err);
      this.currentUtterance = null;
      this.notify(false, '');
      onComplete?.();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.notify(false, '');
    }
  }

  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechService = new SpeechService();

export function speakMedicineInstructions(medicine, lang = 'en', onComplete) {
  let text = '';
  const isHi = lang === 'hi';

  if (isHi) {
    const name = medicine.nameHindi || medicine.name;
    const dose = medicine.dosageHindi || medicine.dosage;
    const time = medicine.timeHindi || medicine.scheduledTime || '';
    const inst = medicine.instructionsHindi || medicine.instructions || 'पानी के साथ लें।';
    text = `दवा: ${name}। खुराक: ${dose}। समय: ${time}। निर्देश: ${inst}`;
  } else {
    const name = medicine.name;
    const dose = medicine.dosage;
    const time = medicine.scheduledTime || '';
    const inst = medicine.instructions || 'Take with water.';
    text = `Medicine: ${name}. Dose: ${dose}. Time: ${time}. Instructions: ${inst}`;
  }

  speechService.speak(text, isHi ? 'hi-IN' : 'en-IN', onComplete);
}
