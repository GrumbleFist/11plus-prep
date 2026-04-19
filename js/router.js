// Hash-based SPA router
// Routes: #/profiles (picker), #/ (home), #/dev, #/question/:subject/:index, #/dashboard

import { getActiveProfile } from './profiles.js';

const views = {};
let currentView = null;

export function registerView(name, viewModule) {
  views[name] = viewModule;
}

export function navigate(hash) {
  window.location.hash = hash;
}

export function init() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  const parts = hash.slice(2).split('/'); // Remove '#/'
  const route = parts[0] || 'home';
  const params = parts.slice(1);

  // Map route names to view names
  const viewName = route === '' ? 'home' : route;

  // Profile gate: block every view except the picker until a profile is active.
  if (viewName !== 'profiles' && !getActiveProfile()) {
    navigate('#/profiles');
    return;
  }

  // Hide ALL views first (prevents stale content showing)
  Object.keys(views).forEach(name => {
    const el = document.getElementById(`view-${name}`);
    if (el) el.classList.add('hidden');
  });
  if (currentView && views[currentView] && views[currentView].hide) {
    views[currentView].hide();
  }

  // Show new view
  if (views[viewName]) {
    const el = document.getElementById(`view-${viewName}`);
    if (el) {
      el.classList.remove('hidden');
      // Re-trigger animation
      el.style.animation = 'none';
      el.offsetHeight; // force reflow
      el.style.animation = '';
    }
    currentView = viewName;

    // Scroll to top of page on every navigation
    window.scrollTo(0, 0);

    if (views[viewName].show) views[viewName].show(...params);
  } else {
    // Fallback to home
    navigate('#/');
  }
}
