// Results view — post-level summary showing score, time, and next steps

import { SUBJECT_META, createBackButton } from '../ui.js';
import { navigate } from '../router.js';
import { getProgress, saveProgress } from '../storage.js';
import { registerLevelComplete, launchConfetti, showBadgeToast, showLevelUpToast, xpProgress } from '../gamification.js';
import { getTree } from '../data/loader.js';

let lastResults = null;
let lastSubject = null;
let lastLevel = null;
let lastBranchId = null;

export function init() {}

export function showResults(results, subject, level, branchId = null) {
  lastResults = results;
  lastSubject = subject;
  lastLevel = level;
  lastBranchId = branchId;
  navigate('#/results');
}

export async function show() {
  const view = document.getElementById('view-results');
  view.innerHTML = '';

  if (!lastResults || !lastSubject) {
    navigate('#/');
    return;
  }

  const meta = SUBJECT_META[lastSubject];
  const total = lastResults.length;
  const correct = lastResults.filter(r => r.isCorrect).length;
  const score = Math.round((correct / total) * 100);
  const avgTime = Math.round(lastResults.reduce((sum, r) => sum + r.timeTakenMs, 0) / total / 1000);
  const withinTime = lastResults.filter(r => r.withinTime).length;
  const passed = correct >= Math.ceil(total * 0.6); // 60% to pass
  const perfect = correct === total;

  // Detect gate level so we can award the bigger XP bonus
  let isGate = false;
  if (lastBranchId) {
    try {
      const tree = await getTree(lastSubject);
      const branch = tree.branches.find(b => b.id === lastBranchId);
      const levelDef = branch && (branch.levels || []).find(l => l.level === lastLevel);
      if (levelDef && (levelDef.note === '5/5 gate' || levelDef.passThreshold === 1.0)) {
        isGate = true;
      }
    } catch {}
  }

  // Gamification: award level-complete bonuses (XP, badges, level-up)
  let gamify = { xpGained: 0, badges: [], leveledUp: false };
  try {
    gamify = registerLevelComplete({ score: correct, total, isGate });
    if (perfect) launchConfetti();
    if (gamify.badges && gamify.badges.length) {
      gamify.badges.forEach((b, i) => setTimeout(() => showBadgeToast(b), 400 + i * 700));
    }
    if (gamify.leveledUp) {
      setTimeout(() => showLevelUpToast(gamify.newLevel), 800);
    }
  } catch (err) {
    console.warn('Gamification level-complete hook failed:', err);
  }

  // Update progress if passed. Track per-branch progress when branchId is present,
  // otherwise keep writing to the legacy flat structure for backwards compatibility.
  if (passed && lastLevel) {
    try {
      const progress = await getProgress(lastSubject) || { subject: lastSubject, currentLevel: 1, completedLevels: [] };
      progress.subject = lastSubject;

      if (lastBranchId) {
        progress.branches = progress.branches || {};
        const bp = progress.branches[lastBranchId] || { currentLevel: 1, completedLevels: [] };
        if (!bp.completedLevels.includes(lastLevel)) {
          bp.completedLevels.push(lastLevel);
        }
        if (lastLevel >= bp.currentLevel) {
          bp.currentLevel = lastLevel + 1;
        }
        progress.branches[lastBranchId] = bp;
      } else {
        if (!progress.completedLevels.includes(lastLevel)) {
          progress.completedLevels.push(lastLevel);
        }
        if (lastLevel >= progress.currentLevel) {
          progress.currentLevel = Math.min(lastLevel + 1, 100);
        }
      }

      await saveProgress(progress);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }

  // Header
  const header = document.createElement('div');
  header.className = 'results-header';

  const emoji = perfect ? '🏆' : score >= 80 ? '🌟' : score >= 60 ? '👍' : '💪';
  const message = perfect
    ? 'Perfect!'
    : score >= 80 ? 'Brilliant!' : score >= 60 ? 'Well done!' : 'Keep practising!';

  header.innerHTML = `
    <div class="results-emoji ${perfect ? 'results-emoji-perfect' : ''}">${emoji}</div>
    <h2 class="results-message">${message}</h2>
    ${lastLevel ? `<p class="results-level">Level ${lastLevel} — ${meta.name}</p>` : `<p class="results-level">${meta.name}</p>`}
  `;
  view.appendChild(header);

  // XP reward panel
  if (gamify.xpGained > 0) {
    const prog = xpProgress();
    const xpCard = document.createElement('div');
    xpCard.className = 'xp-reward-card';
    xpCard.innerHTML = `
      <div class="xp-reward-top">
        <span class="xp-reward-icon">⭐</span>
        <span class="xp-reward-amount">+${gamify.xpGained} XP</span>
        ${isGate && perfect ? '<span class="xp-reward-tag">Gate mastered</span>' : perfect ? '<span class="xp-reward-tag">Perfect bonus</span>' : ''}
      </div>
      <div class="xp-reward-bar">
        <div class="xp-reward-fill" style="width:${prog.pctToNext}%"></div>
      </div>
      <div class="xp-reward-sub">${prog.title} · Level ${prog.level} · ${prog.intoLevel} / ${prog.spanToNext} XP</div>
    `;
    view.appendChild(xpCard);
  }

  // Score card
  const scoreCard = document.createElement('div');
  scoreCard.className = 'results-score-card';
  scoreCard.innerHTML = `
    <div class="score-circle score-${score >= 80 ? 'great' : score >= 60 ? 'good' : 'try-again'}">
      <div class="score-number">${correct}/${total}</div>
      <div class="score-percent">${score}%</div>
    </div>
  `;
  view.appendChild(scoreCard);

  // Stats
  const stats = document.createElement('div');
  stats.className = 'results-stats';
  stats.innerHTML = `
    <div class="stat-item">
      <div class="stat-value">${avgTime}s</div>
      <div class="stat-label">Avg. time per question</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${withinTime}/${total}</div>
      <div class="stat-label">Answered within time</div>
    </div>
  `;
  view.appendChild(stats);

  // Question breakdown
  const breakdown = document.createElement('div');
  breakdown.className = 'results-breakdown';
  breakdown.innerHTML = '<h3>Question Breakdown</h3>';

  lastResults.forEach((r, i) => {
    const row = document.createElement('div');
    row.className = `results-row ${r.isCorrect ? 'correct' : 'incorrect'}`;
    row.innerHTML = `
      <span class="results-q-num">Q${i + 1}</span>
      <span class="results-q-icon">${r.isCorrect ? '✅' : '❌'}</span>
      <span class="results-q-time">${Math.round(r.timeTakenMs / 1000)}s</span>
      <span class="results-q-topic">${r.topic || ''}</span>
    `;
    breakdown.appendChild(row);
  });
  view.appendChild(breakdown);

  // Action buttons
  const actions = document.createElement('div');
  actions.className = 'results-actions';

  const introPath = (lv) => lastBranchId
    ? `#/intro/${lastSubject}/${lastBranchId}/${lv}`
    : `#/intro/${lastSubject}/${lv}`;

  if (passed && lastLevel && lastLevel < 100) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-next';
    nextBtn.textContent = `Next Level (${lastLevel + 1})`;
    nextBtn.addEventListener('click', () => {
      navigate(introPath(lastLevel + 1));
    });
    actions.appendChild(nextBtn);
  } else if (!passed) {
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn-next';
    retryBtn.textContent = 'Try Again';
    retryBtn.addEventListener('click', () => {
      navigate(introPath(lastLevel));
    });
    actions.appendChild(retryBtn);
  }

  const backBtn = document.createElement('button');
  backBtn.className = 'btn-skip';
  backBtn.textContent = `Back to ${meta.name}`;
  backBtn.addEventListener('click', () => {
    navigate(`#/subject/${lastSubject}`);
  });
  actions.appendChild(backBtn);

  const homeBtn = document.createElement('button');
  homeBtn.className = 'btn-skip';
  homeBtn.textContent = 'Home';
  homeBtn.addEventListener('click', () => {
    navigate('#/');
  });
  actions.appendChild(homeBtn);

  view.appendChild(actions);

  // Clear last results
  // (keep them until user navigates away so back button works)
}

export function hide() {}
