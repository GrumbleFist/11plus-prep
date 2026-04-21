// Achievement catalogue + modal + gallery UI.
// Tier badges + misc badges come from gamification.js (static).
// Branch + subject badges are derived from the tree JSONs (dynamic).
// Modal blocks the user with an "Awesome!" button — they must accept.

import { getTree } from './data/loader.js';
import { SUBJECT_META } from './ui.js';
import {
  getLearnerState,
  getPendingBadges,
  acceptPendingBadge,
  TIER_BADGES,
  MISC_BADGES
} from './gamification.js';

const SUBJECT_BADGE_ICONS = {
  english: '📚',
  maths: '🧮',
  verbal: '💡',
  nonverbal: '🧩'
};

const BRANCH_BADGE_ICONS = {
  english: '📖',
  maths: '🔢',
  verbal: '💬',
  nonverbal: '🔷'
};

function subjectName(key) {
  return SUBJECT_META[key]?.name || key;
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
}

// ---- Catalogue builders ----

export function getBranchBadgeMeta(subjectKey, branchId, branchLabel) {
  const sName = subjectName(subjectKey);
  return {
    key: `branch-${subjectKey}-${branchId}`,
    label: branchLabel || branchId,
    icon: BRANCH_BADGE_ICONS[subjectKey] || '🎯',
    description: `Finish every level in ${sName} · ${branchLabel || branchId}.`,
    category: `${sName} branches`,
    subject: subjectKey,
    branchId
  };
}

export function getSubjectBadgeMeta(subjectKey) {
  const sName = subjectName(subjectKey);
  return {
    key: `subject-${subjectKey}`,
    label: `${sName} Champion`,
    icon: SUBJECT_BADGE_ICONS[subjectKey] || '🏆',
    description: `Complete every branch in ${sName}.`,
    category: 'Subject mastery',
    subject: subjectKey
  };
}

export async function getAllBadges() {
  const out = [];
  // Tier badges first (fixed order)
  for (const t of TIER_BADGES) out.push(t);
  // Then per-subject branch + subject badges
  for (const key of Object.keys(SUBJECT_META)) {
    try {
      const tree = await getTree(key);
      const sName = SUBJECT_META[key].name;
      for (const b of tree.branches || []) {
        out.push(getBranchBadgeMeta(key, b.id, b.childFriendlyName || b.displayName || b.id));
      }
      out.push(getSubjectBadgeMeta(key));
    } catch (err) {
      console.warn('Badge catalogue build failed for subject', key, err);
    }
  }
  // Misc / mastery / streak
  for (const m of MISC_BADGES) out.push(m);
  return out;
}

// Check whether every level of a branch sits in progress.completedLevels.
// `completedLevels` already reflects the existing 60%-or-better pass rule.
export async function isBranchComplete(subject, branchId, progress) {
  try {
    const tree = await getTree(subject);
    const branch = tree.branches.find(b => b.id === branchId);
    if (!branch) return false;
    const allLevels = (branch.levels || []).map(l => l.level);
    if (allLevels.length === 0) return false;
    const done = progress?.branches?.[branchId]?.completedLevels || [];
    return allLevels.every(lv => done.includes(lv));
  } catch {
    return false;
  }
}

export async function isSubjectComplete(subject, progress) {
  try {
    const tree = await getTree(subject);
    for (const b of tree.branches || []) {
      const bDone = await isBranchComplete(subject, b.id, progress);
      if (!bDone) return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ---- Modal (blocking, user must accept) ----

let modalQueue = [];
let modalOpen = false;

export function enqueueBadgeModal(badges) {
  const list = Array.isArray(badges) ? badges : [badges];
  for (const b of list) {
    if (b && !modalQueue.some(m => m.key === b.key)) modalQueue.push(b);
  }
  if (!modalOpen) drainModalQueue();
}

function drainModalQueue() {
  if (modalQueue.length === 0) { modalOpen = false; return; }
  modalOpen = true;
  showBadgeModal(modalQueue.shift());
}

function showBadgeModal(badge) {
  const overlay = document.createElement('div');
  overlay.className = 'achievement-overlay';
  overlay.innerHTML = `
    <div class="achievement-modal" role="dialog" aria-modal="true" aria-labelledby="ach-title">
      <div class="achievement-burst">✨</div>
      <div class="achievement-icon">${escapeHtml(badge.icon || '🏆')}</div>
      <div class="achievement-banner">Achievement Unlocked!</div>
      <div class="achievement-title" id="ach-title">${escapeHtml(badge.label)}</div>
      ${badge.description ? `<div class="achievement-desc">${escapeHtml(badge.description)}</div>` : ''}
      <button class="achievement-accept" type="button">Awesome!</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  const dismiss = () => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 320);
    try { acceptPendingBadge(badge.key); } catch {}
    setTimeout(drainModalQueue, 360);
  };
  overlay.querySelector('.achievement-accept').addEventListener('click', dismiss);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) dismiss();
  });
  // ESC key — accept + dismiss
  const keyHandler = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      document.removeEventListener('keydown', keyHandler);
      dismiss();
    }
  };
  document.addEventListener('keydown', keyHandler);
}

// Open any pending (unaccepted) badges that persisted across reloads.
export function showPendingBadges() {
  const pending = getPendingBadges();
  if (pending.length > 0) enqueueBadgeModal(pending);
}

// ---- Gallery (earned vs locked grid) ----

export async function renderBadgeGallery(opts = {}) {
  const { compact = false } = opts;
  const all = await getAllBadges();
  const state = getLearnerState();
  const earned = state.badges || {};

  const wrap = document.createElement('div');
  wrap.className = 'badge-gallery' + (compact ? ' badge-gallery-compact' : '');

  const earnedCount = all.filter(b => earned[b.key]).length;

  const header = document.createElement('div');
  header.className = 'badge-gallery-header';
  header.innerHTML = `
    <h3>Achievements</h3>
    <span class="badge-gallery-count">${earnedCount} / ${all.length}</span>
  `;
  wrap.appendChild(header);

  const groups = new Map();
  for (const b of all) {
    if (!groups.has(b.category)) groups.set(b.category, []);
    groups.get(b.category).push(b);
  }

  for (const [cat, items] of groups) {
    const section = document.createElement('div');
    section.className = 'badge-gallery-section';

    const catEarned = items.filter(b => earned[b.key]).length;
    const heading = document.createElement('button');
    heading.type = 'button';
    heading.className = 'badge-gallery-cat';
    heading.innerHTML = `
      <span class="badge-gallery-cat-name">${escapeHtml(cat)}</span>
      <span class="badge-gallery-cat-count">${catEarned} / ${items.length}</span>
      <span class="badge-gallery-cat-caret">▾</span>
    `;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'badge-grid';
    // Earned first, locked after
    const sorted = [...items].sort((a, b) => {
      const ea = earned[a.key] ? 0 : 1;
      const eb = earned[b.key] ? 0 : 1;
      return ea - eb;
    });
    for (const b of sorted) {
      const isEarned = !!earned[b.key];
      const tile = document.createElement('div');
      tile.className = `badge-tile ${isEarned ? 'badge-earned' : 'badge-locked'}`;
      tile.title = b.description || '';
      tile.innerHTML = `
        <div class="badge-tile-icon">${isEarned ? escapeHtml(b.icon) : '🔒'}</div>
        <div class="badge-tile-label">${escapeHtml(b.label)}</div>
        <div class="badge-tile-desc">${escapeHtml(b.description || '')}</div>
      `;
      grid.appendChild(tile);
    }
    section.appendChild(grid);

    // Collapse/expand
    if (compact) section.classList.add('collapsed');
    heading.addEventListener('click', () => {
      section.classList.toggle('collapsed');
    });

    wrap.appendChild(section);
  }

  return wrap;
}
