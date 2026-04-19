// Home screen — learner banner + 4 subject cards with per-profile icons.

import { SUBJECT_META } from '../ui.js';
import { navigate } from '../router.js';
import { renderLearnerBanner } from '../gamification.js';
import { getActiveProfileMeta, clearActiveProfile, PROFILES } from '../profiles.js';

function render() {
  const view = document.getElementById('view-home');
  const profile = getActiveProfileMeta();

  if (!profile) {
    navigate('#/profiles');
    return;
  }

  const switchPill = `
    <div class="profile-switch-pill" id="btn-switch-profile" title="Switch user">
      <img src="${profile.icon}" alt="${profile.name}">
      <span>${profile.name}</span>
      <span class="profile-switch-caret">⇄</span>
    </div>
  `;

  view.innerHTML = `
    ${switchPill}
    ${renderLearnerBanner()}

    <div class="home-header">
      <h1>Hi ${profile.name}! <span class="home-wave">👋</span></h1>
      <p class="subtitle">Pick a subject to start practising!</p>
    </div>

    <div class="subject-grid subject-grid-icons">
      ${Object.entries(SUBJECT_META).map(([key, meta]) => {
        const iconSrc = profile.subjectIcons[key];
        return `
          <div class="subject-card subject-card-image card-${meta.color}" data-subject="${key}">
            <div class="subject-card-art">
              <img src="${iconSrc}" alt="${meta.name}" loading="lazy">
            </div>
            <div class="subject-card-label">
              <div class="card-title">${meta.name}</div>
              <div class="card-subtitle">Skill tree</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="dashboard-link" id="btn-dashboard">
      📊 Parent Dashboard
    </div>

    <div class="dev-link" id="btn-dev">DEV</div>
  `;

  view.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      const subject = card.dataset.subject;
      navigate(`#/subject/${subject}`);
    });
  });

  view.querySelector('#btn-dashboard').addEventListener('click', () => {
    navigate('#/dashboard');
  });

  view.querySelector('#btn-dev').addEventListener('click', () => {
    navigate('#/dev');
  });

  view.querySelector('#btn-switch-profile').addEventListener('click', () => {
    clearActiveProfile();
    navigate('#/profiles');
    // Reload so the previous profile's IndexedDB handle is released and a fresh
    // storage init happens on the next selection.
    setTimeout(() => window.location.reload(), 50);
  });
}

export function init() {
  // Don't render until we know if there's a profile — router handles redirect.
}

export function show() {
  render();
}

export function hide() {}
