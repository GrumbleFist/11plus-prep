// Results view — post-level summary showing score, time, and next steps

import { SUBJECT_META, createBackButton } from '../ui.js';
import { navigate } from '../router.js';
import { getProgress, saveProgress } from '../storage.js';

let lastResults = null;
let lastSubject = null;
let lastLevel = null;

export function init() {}

export function showResults(results, subject, level) {
  lastResults = results;
  lastSubject = subject;
  lastLevel = level;
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

  // Update progress if passed
  if (passed && lastLevel) {
    try {
      const progress = await getProgress(lastSubject) || { subject: lastSubject, currentLevel: 1, completedLevels: [] };
      if (!progress.completedLevels.includes(lastLevel)) {
        progress.completedLevels.push(lastLevel);
      }
      if (lastLevel >= progress.currentLevel) {
        progress.currentLevel = Math.min(lastLevel + 1, 100);
      }
      progress.subject = lastSubject;
      await saveProgress(progress);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }

  // Header
  const header = document.createElement('div');
  header.className = 'results-header';

  const emoji = score >= 80 ? '🌟' : score >= 60 ? '👍' : '💪';
  const message = score >= 80 ? 'Brilliant!' : score >= 60 ? 'Well done!' : 'Keep practising!';

  header.innerHTML = `
    <div class="results-emoji">${emoji}</div>
    <h2 class="results-message">${message}</h2>
    ${lastLevel ? `<p class="results-level">Level ${lastLevel} — ${meta.name}</p>` : `<p class="results-level">${meta.name}</p>`}
  `;
  view.appendChild(header);

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

  if (passed && lastLevel && lastLevel < 100) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-next';
    nextBtn.textContent = `Next Level (${lastLevel + 1})`;
    nextBtn.addEventListener('click', () => {
      navigate(`#/intro/${lastSubject}/${lastLevel + 1}`);
    });
    actions.appendChild(nextBtn);
  } else if (!passed) {
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn-next';
    retryBtn.textContent = 'Try Again';
    retryBtn.addEventListener('click', () => {
      navigate(`#/intro/${lastSubject}/${lastLevel}`);
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
