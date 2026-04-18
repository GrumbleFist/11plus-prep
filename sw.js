const CACHE_NAME = '11plus-v19';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/router.js',
  './js/storage.js',
  './js/ui.js',
  './js/timer.js',
  './js/views/home.js',
  './js/views/question.js',
  './js/views/dev.js',
  './js/views/subject.js',
  './js/views/intro.js',
  './js/views/play.js',
  './js/views/results.js',
  './js/views/dashboard.js',
  './js/generators/difficulty.js',
  './js/generators/maths.js',
  './js/generators/english.js',
  './js/generators/verbal.js',
  './js/generators/nonverbal.js',
  './js/data/intro-content.js',
  './js/data/loader.js',
  './js/data/bankAdapter.js',
  './js/data/trees/english.json',
  './js/data/trees/maths.json',
  './js/data/trees/verbal.json',
  './js/data/trees/nonverbal.json',
  './js/data/banks/english/spelling.json',
  './js/data/banks/english/vocabulary.json',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
