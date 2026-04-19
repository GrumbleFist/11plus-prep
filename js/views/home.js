// Home screen — learner banner + 4 subject cards + dashboard link + DEV corner

import { SUBJECT_META } from '../ui.js';
import { navigate } from '../router.js';
import { renderLearnerBanner } from '../gamification.js';

function render() {
  const view = document.getElementById('view-home');

  view.innerHTML = `
    ${renderLearnerBanner()}

    <div class="home-header">
      <h1>11+ Practice</h1>
      <p class="subtitle">Choose a subject to start practising!</p>
    </div>

    <div class="subject-grid">
      ${Object.entries(SUBJECT_META).map(([key, meta]) => `
        <div class="subject-card" data-subject="${key}">
          <div class="card-icon">${meta.icon}</div>
          <div class="card-title">${meta.name}</div>
          <div class="card-subtitle">Skill tree</div>
        </div>
      `).join('')}
    </div>

    <div class="dashboard-link" id="btn-dashboard">
      \uD83D\uDCCA Parent Dashboard
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
}

export function init() {
  render();
}

export function show() {
  render();
}

export function hide() {}
