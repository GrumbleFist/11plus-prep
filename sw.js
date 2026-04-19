const CACHE_NAME = '11plus-v24';
const IMAGE_CACHE = '11plus-images-v1';

const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/router.js',
  './js/storage.js',
  './js/ui.js',
  './js/timer.js',
  './js/gamification.js',
  './js/profiles.js',
  './js/views/home.js',
  './js/views/question.js',
  './js/views/dev.js',
  './js/views/subject.js',
  './js/views/intro.js',
  './js/views/play.js',
  './js/views/results.js',
  './js/views/dashboard.js',
  './js/views/profile.js',
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
  './js/data/banks/english/cloze.json',
  './js/data/banks/english/synonyms-antonyms.json',
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
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== IMAGE_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - Profile/subject images (assets/images/**): stale-while-revalidate in IMAGE_CACHE
// - Everything else: cache-first from CACHE_NAME, fall back to network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.includes('/assets/images/')) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          const networkFetch = fetch(event.request).then(response => {
            if (response && response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
