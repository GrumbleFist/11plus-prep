// 11+ Practice App — Entry Point

import { registerView, init as initRouter } from './router.js';
import { init as initStorage } from './storage.js';
import { updateDailyStreak } from './gamification.js';
import { getActiveProfile } from './profiles.js';
import * as homeView from './views/home.js';
import * as questionView from './views/question.js';
import * as devView from './views/dev.js';
import * as subjectView from './views/subject.js';
import * as introView from './views/intro.js';
import * as playView from './views/play.js';
import * as resultsView from './views/results.js';
import * as dashboardView from './views/dashboard.js';
import * as profileView from './views/profile.js';

async function start() {
  // Register views FIRST so the router has them before the hash fires.
  registerView('home', homeView);
  registerView('question', questionView);
  registerView('dev', devView);
  registerView('subject', subjectView);
  registerView('intro', introView);
  registerView('play', playView);
  registerView('results', resultsView);
  registerView('dashboard', dashboardView);
  registerView('profiles', profileView);

  // Initialise views (safe — no storage calls at this stage)
  homeView.init();
  questionView.init();
  devView.init();
  subjectView.init();
  introView.init();
  playView.init();
  resultsView.init();
  dashboardView.init();
  profileView.init();

  // Only initialise storage + daily streak if a profile is already chosen.
  // First-time visitors get routed to the profile picker, which calls
  // initStorage itself after selection.
  const profile = getActiveProfile();
  if (profile) {
    try {
      await initStorage(profile);
    } catch (err) {
      console.error('Storage init failed:', err);
    }
    try {
      updateDailyStreak();
    } catch (err) {
      console.warn('Daily streak update failed:', err);
    }
  }

  // Start router
  initRouter();

  // Register service worker
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (err) {
      console.error('Service worker registration failed:', err);
    }
  }
}

start();
