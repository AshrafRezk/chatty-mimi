
// Service worker for Mimi AI Assistant PWA
const CACHE_NAME = 'mimi-ai-v1.2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/chat',
  '/manifest.json',
  '/mimi-favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/sounds/message-received.mp3',
  '/sounds/message-sent.mp3'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Clearing old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Immediately claim clients so the page doesn't need to be refreshed
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and browser extensions
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Special handling for iOS Safari 
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // For navigation requests (HTML pages), use a network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok && response.status === 0) {
            throw new Error('Network response was not ok');
          }
          // Cache a copy of the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Modified approach for iOS Safari to prevent conflicts
  if (isIOS) {
    // Network-first approach for iOS
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          // Only cache successful responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // Standard cache-first approach for other browsers
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(event.request)
            .then(response => {
              // Don't cache if not a success response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Cache a copy of the response
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              // If both cache and network fail, return a basic offline message for HTML
              if (event.request.headers.get('accept')?.includes('text/html')) {
                return caches.match('/index.html');
              }
              return new Response('Network error happened', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'New notification from Mimi AI',
    icon: 'icons/icon-192x192.png',
    badge: 'icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/chat'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Mimi AI Update',
      options
    )
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
