const CACHE_NAME = 'radio-coran-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './3dK88qLo_400x400.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // On ne touche jamais au flux audio ni aux requêtes non-GET : le navigateur les gère directement.
  if (req.method !== 'GET' || req.destination === 'audio' || req.url.includes('radiojar.com')) return;
  event.respondWith(caches.match(req).then((res) => res || fetch(req)));
});
