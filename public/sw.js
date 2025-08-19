// Service Worker for caching and performance optimization
const CACHE_NAME = 'pump-parade-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Resources to cache on install
const PRECACHE_URLS = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/favicon.png',
  '/manifest.json'
];

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  api: 'networkFirst',
  static: 'cacheFirst',
  images: 'cacheFirst',
  css: 'staleWhileRevalidate',
  js: 'staleWhileRevalidate'
};

// Install event - precache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests
  if (url.pathname.includes('/api/') || url.hostname.includes('coingecko') || url.hostname.includes('pumpparade')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Handle CSS and JS files
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(staleWhileRevalidateStrategy(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Default to network first
  event.respondWith(networkFirstStrategy(request));
});

// Network First Strategy (for API calls and navigation)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Cache First Strategy (for images and static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Resource not available', { status: 404 });
  }
}

// Stale While Revalidate Strategy (for CSS/JS)
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || networkResponsePromise;
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle failed requests when back online
  console.log('Background sync triggered');
}