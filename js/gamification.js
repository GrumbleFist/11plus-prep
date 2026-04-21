// Gamification — XP, learner level, streaks, daily streak, badges.
// Persists to localStorage (synchronous, no DB round-trip).
// Badges awarded here go into `pendingBadges`; the badges.js modal
// drains that queue at end-of-level so nothing interrupts mid-play.

import { getActiveProfile } from './profiles.js';

const BASE_STORAGE_KEY = '11plus-learner';
function storageKey() {
  const id = getActiveProfile() || 'guest';
  return `${BASE_STORAGE_KEY}-${id}`;
}

const XP = {
  CORRECT: 10,
  WITHIN_TIME: 5,
  PERFECT_LEVEL: 25,
  GATE_PASS: 50,
  STREAK_MOMENTUM: 5
};

const LEARNER_TITLES = [
  'Rookie',
  'Explorer',
  'Learner',
  'Scholar',
  'Champion',
  'Master',
  'Grandmaster',
  'Legend',
  'Prodigy',
  'Mastermind'
];

const TIER_ICONS = ['⭐', '🌱', '📘', '🎓', '🏅', '💎', '👑', '⚡', '🌟', '🧠'];

// Static catalogue — exported so badges.js can render the gallery.
export const TIER_BADGES = LEARNER_TITLES.map((title, i) => ({
  key: `tier-${i + 1}`,
  label: `${title} (Level ${i + 1})`,
  icon: TIER_ICONS[i],
  description: `Reach learner Level ${i + 1}.`,
  category: 'XP Tiers',
  tier: i + 1
}));

export const MISC_BADGES = [
  { key: 'streak3',      label: 'On Fire!',           icon: '🔥', description: '3 correct answers in a row.', category: 'Streaks' },
  { key: 'streak5',      label: 'Unstoppable!',       icon: '⚡', description: '5 correct answers in a row.', category: 'Streaks' },
  { key: 'streak10',     label: 'Legendary Streak!',  icon: '🌟', description: '10 correct answers in a row.', category: 'Streaks' },
  { key: 'perfectScore', label: 'Perfect Score!',     icon: '💯', description: 'Scored full marks on a level.', category: 'Mastery' },
  { key: 'gateMaster',   label: 'Gate Master!',       icon: '🏆', description: 'Passed a 5/5 gate level.', category: 'Mastery' }
];

const MISC_BY_KEY = Object.fromEntries(MISC_BADGES.map(b => [b.key, b]));

// Cumulative XP required to reach each learner level.
// L1=0, L2=100, L3=300, L4=600, L5=1000, L6=1500, ... triangular growth.
function xpThreshold(level) {
  if (level <= 1) return 0;
  const n = level - 1;
  return 50 * n * (n + 1);
}

function levelFromXP(xp) {
  let lvl = 1;
  while (xpThreshold(lvl + 1) <= xp) lvl++;
  return lvl;
}

function defaultState() {
  return {
    xp: 0,
    learnerLevel: 1,
    bestStreak: 0,
    dailyStreak: 0,
    lastPlayedDate: null,
    badges: {},
    pendingBadges: [],
    totalCorrect: 0,
    totalAnswered: 0,
    totalLevelsPassed: 0,
    lastDailyBonusDate: null
  };
}

function load() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function save(state) {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save learner state:', e);
  }
}

let sessionStreak = 0;

export function getLearnerState() {
  return load();
}

export function getSessionStreak() {
  return sessionStreak;
}

export function resetSessionStreak() {
  sessionStreak = 0;
}

export function xpProgress() {
  const s = load();
  const lvl = s.learnerLevel;
  const currentFloor = xpThreshold(lvl);
  const nextFloor = xpThreshold(lvl + 1);
  const span = nextFloor - currentFloor;
  const into = s.xp - currentFloor;
  return {
    level: lvl,
    title: LEARNER_TITLES[Math.min(lvl - 1, LEARNER_TITLES.length - 1)],
    xp: s.xp,
    intoLevel: into,
    spanToNext: span,
    pctToNext: span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 100
  };
}

// Award a badge by full meta object. Records earned-date in state.badges
// and adds the meta to state.pendingBadges so the modal can surface it.
// Returns the meta if newly awarded, null if it was already earned.
function awardBadgeMeta(state, meta) {
  if (!meta || !meta.key) return null;
  if (state.badges[meta.key]) return null;
  state.badges[meta.key] = new Date().toISOString();
  state.pendingBadges = state.pendingBadges || [];
  if (!state.pendingBadges.some(b => b.key === meta.key)) {
    state.pendingBadges.push({ ...meta, earnedAt: state.badges[meta.key] });
  }
  return meta;
}

function awardTierBadges(state, prevLevel, newLevel, events) {
  for (let t = prevLevel + 1; t <= newLevel; t++) {
    const meta = TIER_BADGES[t - 1];
    const awarded = awardBadgeMeta(state, meta);
    if (awarded) events.badges.push(awarded);
  }
}

function addXP(state, amount, events) {
  if (amount <= 0) return { leveledUp: false };
  const prevLevel = state.learnerLevel;
  state.xp += amount;
  const newLevel = levelFromXP(state.xp);
  state.learnerLevel = newLevel;
  const leveledUp = newLevel > prevLevel;
  if (leveledUp && events) awardTierBadges(state, prevLevel, newLevel, events);
  return { leveledUp, prevLevel, newLevel };
}

export function registerAnswer(isCorrect, withinTime) {
  const state = load();
  const events = { xpGained: 0, streakMilestone: null, badges: [], leveledUp: false };

  state.totalAnswered += 1;

  if (isCorrect) {
    sessionStreak += 1;
    state.totalCorrect += 1;

    let gain = XP.CORRECT + (withinTime ? XP.WITHIN_TIME : 0);
    if (sessionStreak >= 3) gain += XP.STREAK_MOMENTUM;
    events.xpGained = gain;

    if (sessionStreak > state.bestStreak) state.bestStreak = sessionStreak;

    if (sessionStreak === 3) {
      const a = awardBadgeMeta(state, MISC_BY_KEY.streak3);
      if (a) events.badges.push(a);
    }
    if (sessionStreak === 5) {
      const a = awardBadgeMeta(state, MISC_BY_KEY.streak5);
      if (a) events.badges.push(a);
    }
    if (sessionStreak === 10) {
      const a = awardBadgeMeta(state, MISC_BY_KEY.streak10);
      if (a) events.badges.push(a);
    }

    const levelEvent = addXP(state, gain, events);
    events.leveledUp = levelEvent.leveledUp;
    events.prevLevel = levelEvent.prevLevel;
    events.newLevel = levelEvent.newLevel;
  } else {
    sessionStreak = 0;
  }

  save(state);
  events.currentStreak = sessionStreak;
  return events;
}

export function registerLevelComplete({ score, total, isGate }) {
  const state = load();
  const events = { xpGained: 0, badges: [], leveledUp: false, perfect: false };

  if (score >= Math.ceil(total * 0.6)) {
    state.totalLevelsPassed += 1;
  }

  const perfect = score === total;
  if (perfect) {
    events.perfect = true;
    events.xpGained += XP.PERFECT_LEVEL;
    const a = awardBadgeMeta(state, MISC_BY_KEY.perfectScore);
    if (a) events.badges.push(a);
    if (isGate) {
      events.xpGained += XP.GATE_PASS;
      const g = awardBadgeMeta(state, MISC_BY_KEY.gateMaster);
      if (g) events.badges.push(g);
    }
  }

  if (events.xpGained > 0) {
    const levelEvent = addXP(state, events.xpGained, events);
    events.leveledUp = levelEvent.leveledUp;
    events.prevLevel = levelEvent.prevLevel;
    events.newLevel = levelEvent.newLevel;
  }

  save(state);
  return events;
}

// External hook: other modules (e.g. results.js) call this to grant
// branch/subject badges once they detect a completion condition.
export function awardExternalBadge(meta) {
  const state = load();
  const awarded = awardBadgeMeta(state, meta);
  save(state);
  return awarded;
}

export function getPendingBadges() {
  return (load().pendingBadges || []).slice();
}

export function acceptPendingBadge(key) {
  const state = load();
  state.pendingBadges = (state.pendingBadges || []).filter(b => b.key !== key);
  save(state);
}

export function clearAllPendingBadges() {
  const state = load();
  state.pendingBadges = [];
  save(state);
}

export function updateDailyStreak() {
  const state = load();
  const today = new Date().toISOString().slice(0, 10);
  const last = state.lastPlayedDate;

  if (last === today) return { streak: state.dailyStreak, changed: false };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().slice(0, 10);

  if (last === yesterdayISO) {
    state.dailyStreak += 1;
  } else {
    state.dailyStreak = 1;
  }
  state.lastPlayedDate = today;
  save(state);
  return { streak: state.dailyStreak, changed: true };
}

export function renderLearnerBanner() {
  const prog = xpProgress();
  const state = load();
  return `
    <div class="learner-banner">
      <div class="learner-banner-row">
        <div class="learner-level">
          <span class="learner-level-icon">⭐</span>
          <div>
            <div class="learner-level-title">${prog.title}</div>
            <div class="learner-level-num">Level ${prog.level}</div>
          </div>
        </div>
        <div class="learner-daily" title="Daily streak">
          <span class="daily-flame">🔥</span>
          <span class="daily-count">${state.dailyStreak}</span>
          <span class="daily-label">day${state.dailyStreak === 1 ? '' : 's'}</span>
        </div>
      </div>
      <div class="learner-xp-bar">
        <div class="learner-xp-fill" style="width:${prog.pctToNext}%"></div>
        <span class="learner-xp-text">${prog.intoLevel} / ${prog.spanToNext} XP</span>
      </div>
    </div>
  `;
}

export function launchConfetti(durationMs = 2500) {
  const colors = ['#FF6B6B', '#4ECDC4', '#6C63FF', '#FF9F43', '#FDCB6E', '#00B894'];
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const count = 80;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random() * 0.4) + 's';
    p.style.animationDuration = (1.4 + Math.random() * 1.2) + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(p);
  }

  setTimeout(() => container.remove(), durationMs);
}

export function showLevelUpToast(newLevel) {
  const prog = xpProgress();
  const toast = document.createElement('div');
  toast.className = 'gamify-toast gamify-toast-levelup';
  toast.innerHTML = `
    <div class="gamify-toast-icon">🎉</div>
    <div class="gamify-toast-body">
      <div class="gamify-toast-title">Level Up!</div>
      <div class="gamify-toast-sub">You're now ${prog.title} (Level ${newLevel})</div>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

export function showXPGain(amount) {
  if (amount <= 0) return;
  const pop = document.createElement('div');
  pop.className = 'xp-pop';
  pop.textContent = `+${amount} XP`;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 1400);
}

export function showStreakPulse(streak) {
  const pulse = document.createElement('div');
  pulse.className = 'streak-pulse';
  pulse.textContent = `🔥 ${streak}!`;
  document.body.appendChild(pulse);
  setTimeout(() => pulse.remove(), 1200);
}
