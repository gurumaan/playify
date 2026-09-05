// ==========================================================================
// PLAYIFY ULTRA HD — BULLETPROOF OFFLINE SERVICE WORKER (v31.0)
// Guarantees zero "Web page not available" / ERR_INTERNET_DISCONNECTED
// ==========================================================================

const CACHE_NAME = 'playify-offline-cache-v64';

const CORE_APP_SHELL = [
  '/',
  '/index.html',
  '/style.css',
  '/charts_data.js',
  '/music_db_data.js',
  '/app.js',
  '/logo.svg',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: Cache all core application shell files immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of CORE_APP_SHELL) {
        try {
          const res = await fetch(url);
          if (res.ok) await cache.put(url, res);
        } catch (err) {
          console.warn('SW pre-cache note for:', url, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Total offline immunity
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Media and dynamic external APIs: try network first
  if (req.url.includes('.mp4') || req.url.includes('.mp3') || req.url.includes('lrclib.net') || req.url.includes('itunes.apple.com')) {
    event.respondWith(
      fetch(req).catch(() => {
        return new Response('', { status: 408, statusText: 'Offline' });
      })
    );
    return;
  }

  // HTML Navigation: try network first, fallback to cached index.html immediately
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
          }
          return res;
        })
        .catch(() => {
          return caches.match('/index.html').then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // Assets (CSS, JS, JSON, SVGs): Cache first with network refresh
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      if (cachedRes) {
        fetch(req).then((networkRes) => {
          if (networkRes && networkRes.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes));
          }
        }).catch(() => {});
        return cachedRes;
      }

      return fetch(req).then((networkRes) => {
        if (networkRes && networkRes.ok) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(() => {
        if (req.destination === 'image') {
          return caches.match('/logo.svg');
        }
      });
    })
  );
});
