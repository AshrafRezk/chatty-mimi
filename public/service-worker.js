
// Service worker for Mimi AI Assistant PWA
const CACHE_NAME = 'mimi-ai-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/src/index.css',
  '/src/main.tsx',
  '/sounds/message-received.mp3',
  '/sounds/message-sent.mp3',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
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
  // Skip cross-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        
        return fetch(event.request).then((networkResponse) => {
          // Don't cache API responses or dynamic content
          if (
            !event.request.url.includes('/api/') && 
            event.request.method === 'GET'
          ) {
            let responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME).then((cache) => {
              console.log('[Service Worker] Caching new resource:', event.request.url);
              cache.put(event.request, responseToCache);
            });
          }
          
          return networkResponse;
        });
      })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body || 'New notification from Mimi AI',
    icon: 'icons/icon-192x192.png',
    badge: 'icons/badge-72x72.png',
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
