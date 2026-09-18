// Web Audio API Procedural Synthesizer for Little Companion
// Generates soft organic micro-sounds without any external audio files.

let audioCtx = null;
let isAudioMuted = false;
let purrOsc = null;
let purrGain = null;
let purrFilter = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleAudioMute() {
  isAudioMuted = !isAudioMuted;
  if (isAudioMuted) {
    stopPurr();
  }
  return isAudioMuted;
}

export function getAudioMuted() {
  return isAudioMuted;
}

/**
 * Play a gentle organic bubble/pop on single click / poke
 */
export function playPokeSound(pitchMultiplier = 1.0) {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Gentle sine with lowpass warm timbre
  osc.type = 'sine';
  const startFreq = 220 * pitchMultiplier;
  const endFreq = 480 * pitchMultiplier;

  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.09, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.2);
}

/**
 * Play warm pentatonic double-chime on smile
 */
export function playSmileChime() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.09);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);

    const startTime = now + idx * 0.09;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.06, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.7);
  });
}

/**
 * Start organic purring vibration when petting
 */
export function startPurr() {
  if (isAudioMuted || purrOsc) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  purrOsc = ctx.createOscillator();
  purrGain = ctx.createGain();
  purrFilter = ctx.createBiquadFilter();

  // Low frequency modulated purr
  purrOsc.type = 'triangle';
  purrOsc.frequency.setValueAtTime(55, now); // A1 note

  purrFilter.type = 'lowpass';
  purrFilter.frequency.setValueAtTime(140, now);

  purrGain.gain.setValueAtTime(0.0001, now);
  purrGain.gain.linearRampToValueAtTime(0.04, now + 0.2);

  purrOsc.connect(purrFilter);
  purrFilter.connect(purrGain);
  purrGain.connect(ctx.destination);

  purrOsc.start(now);
}

/**
 * Stop purring sound smoothly
 */
export function stopPurr() {
  if (!purrOsc || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    purrGain.gain.linearRampToValueAtTime(0.0001, now + 0.15);
    setTimeout(() => {
      if (purrOsc) {
        purrOsc.stop();
        purrOsc.disconnect();
        purrOsc = null;
        purrGain = null;
        purrFilter = null;
      }
    }, 160);
  } catch (_) {
    purrOsc = null;
  }
}

/**
 * Play a delicate crystal droplet sound when a light mote is spawned
 */
export function playMoteSpawnSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(980, now);
  osc.frequency.exponentialRampToValueAtTime(1480, now + 0.05);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

/**
 * Play warm joyful chime sweep when companion absorbs a light mote
 */
export function playMoteAbsorbSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    const startTime = now + idx * 0.04;
    osc.frequency.setValueAtTime(f, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.055, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.5);
  });
}

/**
 * 1. PAYMENT SUCCESS CHIME
 * Radiant ascending pentatonic bell chime with shimmering harmonics (C5 -> E5 -> G5 -> C6 -> E6).
 */
export function playPaymentSuccessSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, time: 0.00, dur: 0.65, gain: 0.07 }, // C5
    { freq: 659.25, time: 0.08, dur: 0.70, gain: 0.08 }, // E5
    { freq: 783.99, time: 0.16, dur: 0.85, gain: 0.09 }, // G5
    { freq: 1046.50, time: 0.25, dur: 1.10, gain: 0.10 }, // C6
    { freq: 1318.51, time: 0.35, dur: 1.30, gain: 0.08 }  // E6 high sparkle
  ];

  notes.forEach(({ freq, time, dur, gain: noteGain }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    const startTime = now + time;
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(noteGain, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  });
}

/**
 * 2. PAYMENT FAILED / "OOPS" SOUND
 * Soft, sympathetic, pillowy descending minor third (soft acoustic thud: G3 -> E3).
 * Gentle, human, apologetic — not an alarming buzzer.
 */
export function playPaymentFailedSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const thuds = [
    { freqStart: 210, freqEnd: 175, time: 0.00, dur: 0.28, gain: 0.085 },
    { freqStart: 165, freqEnd: 130, time: 0.18, dur: 0.38, gain: 0.075 }
  ];

  thuds.forEach(({ freqStart, freqEnd, time, dur, gain: thudGain }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    const startTime = now + time;
    osc.frequency.setValueAtTime(freqStart, startTime);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, startTime + dur);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(thudGain, startTime + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  });
}

/**
 * 3. NETWORK SEARCHING SONAR PING
 * Rhythmic soft sonar radar blip pinging the ether for connection.
 */
let networkPingTimer = null;

export function startNetworkSearchingSound() {
  stopNetworkSearchingSound();
  if (isAudioMuted) return;

  const ping = () => {
    if (isAudioMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  };

  ping();
  networkPingTimer = setInterval(ping, 1300);
}

export function stopNetworkSearchingSound() {
  if (networkPingTimer) {
    clearInterval(networkPingTimer);
    networkPingTimer = null;
  }
}
