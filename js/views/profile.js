// Profile picker — shows Dorothy & Arnold cards on first load.
// Click a card to activate that profile, init per-profile storage, and jump home.

import { PROFILES, setActiveProfile, getActiveProfile } from '../profiles.js';
import { init as initStorage } from '../storage.js';
import { updateDailyStreak } from '../gamification.js';
import { navigate } from '../router.js';

export function init() {}

export function show() {
  const view = document.getElementById('view-profiles');
  view.innerHTML = '';

  const hero = document.createElement('div');
  hero.className = 'profile-hero';
  hero.innerHTML = `
    <h1 class="profile-hero-title">Who's practising today?</h1>
    <p class="profile-hero-sub">Pick your face to start!</p>
  `;
  view.appendChild(hero);

  const grid = document.createElement('div');
  grid.className = 'profile-grid';

  Object.values(PROFILES).forEach(profile => {
    const card = document.createElement('button');
    card.className = `profile-card profile-card-${profile.id}`;
    card.innerHTML = `
      <div class="profile-card-avatar">
        <img src="${profile.icon}" alt="${profile.name}" loading="eager">
      </div>
      <div class="profile-card-name">${profile.name}</div>
      <div class="profile-card-go">Let's go! →</div>
    `;
    card.addEventListener('click', async () => {
      card.classList.add('profile-card-picked');
      try {
        setActiveProfile(profile.id);
        await initStorage(profile.id);
        updateDailyStreak();
      } catch (err) {
        console.error('Profile init failed:', err);
      }
      setTimeout(() => navigate('#/'), 400);
    });
    grid.appendChild(card);
  });

  view.appendChild(grid);

  const footer = document.createElement('p');
  footer.className = 'profile-footer';
  footer.textContent = 'Each face keeps its own stars, streaks, and progress.';
  view.appendChild(footer);
}

export function hide() {}

// Convenience: called by router before activating any view other than 'profile'.
// Returns true if the app is ready to proceed; false if we redirected to picker.
export function ensureProfileOrRedirect() {
  if (getActiveProfile()) return true;
  navigate('#/profiles');
  return false;
}
