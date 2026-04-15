// 11+ Practice App — Entry Point

import { registerView, init as initRouter } from './router.js';
import { init as initStorage } from './storage.js';
import * as homeView from './views/home.js';
import * as questionView from './views/question.js';
import * as devView from './views/dev.js';
import * as subjectView from './views/subject.js';
import * as introView from './views/intro.js';
import * as playView from './views/play.js';
import * as resultsView from './views/results.js';
import * as dashboardView from './views/dashboard.js';

async function start() {
  // Initialise storage
  try {
    await initStorage();
  } catch (err) {
    console.error('Storage init failed:', err);
  }

  // Register views
  registerView('home', homeView);
  registerView('question', questionView);
  registerView('dev', devView);
  registerView('subject', subjectView);
  registerView('intro', introView);
  registerView('play', playView);
  registerView('results', resultsView);
  registerView('dashboard', dashboardView);

  // Initialise views
  homeView.init();
  questionView.init();
  devView.init();
  subjectView.init();
  introView.init();
  playView.init();
  resultsView.init();
  dashboardView.init();

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
