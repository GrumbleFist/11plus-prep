// Timer logic for question timing
// Levels 1-10: no timer
// Levels 11-20: double time (visible, informational)
// Levels 21-100: standard GL pace with gentle chime

let timerInterval = null;
let remainingMs = 0;
let timerCallback = null;
let chimeAudio = null;
let hasChimed = false;

// Standard GL time per question in seconds
const STANDARD_TIME = 60;

export function getTimeAllowed(level) {
  if (level <= 10) return 0; // no timer
  if (level <= 20) return STANDARD_TIME * 2; // double time
  return STANDARD_TIME; // standard
}

export function getTimerMode(level) {
  if (level <= 10) return 'none';
  if (level <= 20) return 'relaxed';
  return 'standard';
}

export function startTimer(level, onTick, onExpire) {
  stopTimer();

  const seconds = getTimeAllowed(level);
  if (seconds === 0) return; // no timer for this level

  remainingMs = seconds * 1000;
  timerCallback = onTick;
  hasChimed = false;

  timerInterval = setInterval(() => {
    remainingMs -= 100;

    if (remainingMs <= 0) {
      remainingMs = 0;
      if (!hasChimed) {
        hasChimed = true;
        playChime();
        if (onExpire) onExpire();
      }
    }

    if (timerCallback) {
      timerCallback(remainingMs, seconds * 1000);
    }
  }, 100);
}

export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

export function getRemainingMs() {
  return remainingMs;
}

export function isExpired() {
  return hasChimed;
}

export function formatTime(ms) {
  if (ms <= 0) return '0:00';
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getTimerState(ms, totalMs) {
  if (ms <= 0) return 'expired';
  if (ms <= totalMs * 0.25) return 'warning';
  return 'normal';
}

function playChime() {
  try {
    // Generate a gentle chime using Web Audio API
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 523.25; // C5 — gentle, not alarming
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    // Audio not available — fail silently
  }
}
