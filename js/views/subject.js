// Subject view — 10×10 level grid with locked/unlocked/completed states

import { SUBJECT_META, createBackButton } from '../ui.js';
import { navigate } from '../router.js';
import { getProgress } from '../storage.js';
import { getTopicForLevel } from '../generators/difficulty.js';

let currentSubject = null;

export function init() {}

export async function show(subject) {
  currentSubject = subject;
  const view = document.getElementById('view-subject');
  const meta = SUBJECT_META[subject];

  if (!meta) {
    navigate('#/');
    return;
  }

  const progress = await getProgress(subject) || { currentLevel: 1, completedLevels: [] };
  const completed = new Set(progress.completedLevels || []);
  const currentLevel = progress.currentLevel || 1;

  view.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'subject-header';
  header.appendChild(createBackButton('Home', '#/'));

  const titleArea = document.createElement('div');
  titleArea.innerHTML = `
    <h2>${meta.icon} ${meta.name}</h2>
    <p class="subject-progress-text">${completed.size} of 100 levels completed</p>
  `;
  header.appendChild(titleArea);
  view.appendChild(header);

  // Progress summary bar
  const summaryBar = document.createElement('div');
  summaryBar.className = 'subject-summary-bar';
  summaryBar.innerHTML = `
    <div class="progress-bar-container" style="margin-bottom:0">
      <div class="progress-bar-fill fill-${meta.color}" style="width: ${completed.size}%"></div>
    </div>
  `;
  view.appendChild(summaryBar);

  // Level grid (10 rows × 10 columns)
  const grid = document.createElement('div');
  grid.className = 'level-grid';

  for (let level = 1; level <= 100; level++) {
    const btn = document.createElement('button');
    btn.className = 'level-btn';
    btn.textContent = level;

    const isCompleted = completed.has(level);
    const isUnlocked = true; // All levels unlocked for testing
    const isCurrent = level === currentLevel;

    if (isCompleted) {
      btn.classList.add('level-completed');
      btn.classList.add(`level-completed-${meta.color}`);
    } else if (isCurrent) {
      btn.classList.add('level-current');
      btn.classList.add(`level-current-${meta.color}`);
    } else if (isUnlocked) {
      btn.classList.add('level-unlocked');
    } else {
      btn.classList.add('level-locked');
    }

    if (isUnlocked) {
      btn.addEventListener('click', () => {
        navigate(`#/intro/${subject}/${level}`);
      });
    }

    grid.appendChild(btn);
  }

  view.appendChild(grid);

  // Legend
  const legend = document.createElement('div');
  legend.className = 'level-legend';
  legend.innerHTML = `
    <span class="legend-item"><span class="legend-dot level-completed level-completed-${meta.color}"></span> Completed</span>
    <span class="legend-item"><span class="legend-dot level-current level-current-${meta.color}"></span> Current</span>
    <span class="legend-item"><span class="legend-dot level-unlocked"></span> Unlocked</span>
    <span class="legend-item"><span class="legend-dot level-locked"></span> Locked</span>
  `;
  view.appendChild(legend);
}

export function hide() {}
