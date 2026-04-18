// Subject view — renders the Phase 9 skill tree.
// Each branch becomes a section with its own strip of level buttons.
// Click a level -> #/intro/:subject/:branchId/:level

import { SUBJECT_META, createBackButton } from '../ui.js';
import { navigate } from '../router.js';
import { getProgress } from '../storage.js';
import { getTree } from '../data/loader.js';

export function init() {}

export async function show(subject) {
  const view = document.getElementById('view-subject');
  const meta = SUBJECT_META[subject];

  if (!meta) {
    navigate('#/');
    return;
  }

  view.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Loading tree…</p>';

  let tree;
  try {
    tree = await getTree(subject);
  } catch (err) {
    console.error('Failed to load tree:', err);
    view.innerHTML = `<p style="padding:20px;color:#c00">Could not load ${meta.name} tree. Check console.</p>`;
    return;
  }

  const progress = (await getProgress(subject)) || {};
  const branchProgress = progress.branches || {};

  view.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'subject-header';
  header.appendChild(createBackButton('Home', '#/'));

  const totalLevels = tree.totalLevels || tree.branches.reduce((a, b) => a + (b.levelCount || 0), 0);
  const completedCount = Object.values(branchProgress)
    .reduce((a, bp) => a + ((bp.completedLevels && bp.completedLevels.length) || 0), 0);

  const titleArea = document.createElement('div');
  titleArea.innerHTML = `
    <h2>${meta.icon} ${meta.name}</h2>
    <p class="subject-progress-text">${completedCount} of ${totalLevels} levels completed across ${tree.branches.length} branches</p>
  `;
  header.appendChild(titleArea);
  view.appendChild(header);

  // Overall progress bar
  const summaryBar = document.createElement('div');
  summaryBar.className = 'subject-summary-bar';
  const pct = totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0;
  summaryBar.innerHTML = `
    <div class="progress-bar-container" style="margin-bottom:0">
      <div class="progress-bar-fill fill-${meta.color}" style="width:${pct}%"></div>
    </div>
  `;
  view.appendChild(summaryBar);

  // Branches
  const branchList = document.createElement('div');
  branchList.className = 'branch-list';

  for (const branch of tree.branches) {
    const bp = branchProgress[branch.id] || { currentLevel: 1, completedLevels: [] };
    const completedSet = new Set(bp.completedLevels || []);
    const currentLevel = bp.currentLevel || 1;

    const section = document.createElement('section');
    section.className = 'branch-section';

    const brHeader = document.createElement('header');
    brHeader.className = 'branch-header';
    brHeader.innerHTML = `
      <div class="branch-title-row">
        <h3 class="branch-title">${branch.displayName}</h3>
        ${branch.childFriendlyName ? `<span class="branch-friendly">${branch.childFriendlyName}</span>` : ''}
      </div>
      <p class="branch-desc">${branch.description || ''}</p>
      <p class="branch-progress-text">${completedSet.size} / ${branch.levelCount} levels</p>
    `;
    section.appendChild(brHeader);

    const strip = document.createElement('div');
    strip.className = 'branch-strip';

    for (let lv = 1; lv <= branch.levelCount; lv++) {
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      btn.textContent = lv;

      const levelDef = (branch.levels || []).find(l => l.level === lv);
      if (levelDef && levelDef.note === '5/5 gate') {
        btn.classList.add('level-gate');
        btn.title = 'Mastery gate: 5/5 required';
      }

      if (completedSet.has(lv)) {
        btn.classList.add('level-completed', `level-completed-${meta.color}`);
      } else if (lv === currentLevel) {
        btn.classList.add('level-current', `level-current-${meta.color}`);
      } else {
        btn.classList.add('level-unlocked');
      }

      btn.addEventListener('click', () => {
        navigate(`#/intro/${subject}/${branch.id}/${lv}`);
      });

      strip.appendChild(btn);
    }

    section.appendChild(strip);
    branchList.appendChild(section);
  }

  view.appendChild(branchList);
}

export function hide() {}
