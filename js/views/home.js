// Home screen — 4 subject cards + dashboard link + DEV corner

import { SUBJECT_META } from '../ui.js';
import { navigate } from '../router.js';

export function init() {
  const view = document.getElementById('view-home');

  view.innerHTML = `
    <div class="home-header">
      <h1>11+ Practice</h1>
      <p class="subtitle">Choose a subject to start practising!</p>
    </div>

    <div class="subject-grid">
      ${Object.entries(SUBJECT_META).map(([key, meta]) => `
        <div class="subject-card" data-subject="${key}">
          <div class="card-icon">${meta.icon}</div>
          <div class="card-title">${meta.name}</div>
          <div class="card-subtitle">100 levels</div>
        </div>
      `).join('')}
    </div>

    <div class="dashboard-link" id="btn-dashboard">
      \uD83D\uDCCA Parent Dashboard
    </div>

    <div class="dev-link" id="btn-dev">DEV</div>
  `;

  // Subject card clicks
  view.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      const subject = card.dataset.subject;
      navigate(`#/subject/${subject}`);
    });
  });

  // Dashboard click
  view.querySelector('#btn-dashboard').addEventListener('click', () => {
    navigate('#/dashboard');
  });

  // DEV click
  view.querySelector('#btn-dev').addEventListener('click', () => {
    navigate('#/dev');
  });
}

export function show() {
  // Refresh any dynamic content (e.g., progress indicators) here later
}

export function hide() {}
