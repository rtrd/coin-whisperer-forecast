// Enhanced Service Worker for aggressive performance optimization
const CACHE_NAME = 'pump-parade-v2';
const RUNTIME_CACHE = 'runtime-cache-v2';
const IMAGE_CACHE = 'image-cache-v1';
const API_CACHE = 'api-cache-v1';

// Critical resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/favicon.png',
  '/manifest.json',
  // Add critical chunks that will be generated
  '/js/react-vendor.js',
  '/js/router.js',
  '/js/ui-core.js',
  '/css/index.css'
];

// API endpoints to preload
const CRITICAL_API_ENDPOINTS = [
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false',
  'https://server.pumpparade.com/api/crypto-data'
];

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  api: 'networkFirst',
  static: 'cacheFirst',
  images: 'cacheFirst',
  css: 'staleWhileRevalidate',
  js: 'staleWhileRevalidate'
};

// Install event - aggressive precaching
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical app shell
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(PRECACHE_URLS.filter(url => !url.includes('.js')));
      }),
      // Prefetch critical API data
      caches.open(API_CACHE).then((cache) => {
        return Promise.allSettled(
          CRITICAL_API_ENDPOINTS.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                cache.put(url, response.clone());
              }
              return response;
            }).catch(() => {
              // Ignore prefetch failures
            })
          )
        );
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches and warm up
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes('v2') && !cacheName.includes('v1')) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Warm up critical resources
      self.clients.claim(),
      // Preload likely next pages
      preloadCriticalPages()
    ])
  );
});

// Preload critical pages that users are likely to visit
async function preloadCriticalPages() {
  const criticalPages = ['/subscribe', '/tokens', '/ai-prediction'];
  const cache = await caches.open(RUNTIME_CACHE);
  
  return Promise.allSettled(
    criticalPages.map(page => 
      fetch(page).then(response => {
        if (response.ok) {
          cache.put(page, response.clone());
        }
        return response;
      })
    )
  );
}

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests with intelligent caching
  if (url.pathname.includes('/api/') || url.hostname.includes('coingecko') || url.hostname.includes('pumpparade')) {
    // Use different strategies based on API type
    if (url.pathname.includes('markets') || url.pathname.includes('coins')) {
      event.respondWith(staleWhileRevalidateWithTTL(request, 30000)); // 30s TTL for market data
    } else {
      event.respondWith(networkFirstStrategy(request));
    }
    return;
  }

  // Handle images with dedicated cache
  if (request.destination === 'image') {
    event.respondWith(optimizedImageStrategy(request));
    return;
  }

  // Handle CSS and JS files with version-aware caching
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(versionAwareCacheStrategy(request));
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

// Enhanced image caching strategy
async function optimizedImageStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached image and update in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Image not available', { status: 404 });
  }
}

// Version-aware caching for JS/CSS
async function versionAwareCacheStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const url = new URL(request.url);
  
  // If it has a hash, it's immutable - cache forever
  if (url.pathname.includes('-') && url.pathname.match(/\.[a-f0-9]{8,}\./)) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  return staleWhileRevalidateStrategy(request);
}

// Stale while revalidate with TTL
async function staleWhileRevalidateWithTTL(request, ttl = 60000) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0);
    const isStale = Date.now() - cacheTime.getTime() > ttl;
    
    if (!isStale) {
      return cachedResponse;
    }
  }

  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cache-time', new Date().toISOString());
      cache.put(request, responseToCache);
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
  // Retry failed API requests
  const failedRequests = await getFailedRequests();
  
  return Promise.allSettled(
    failedRequests.map(request => 
      fetch(request).then(response => {
        if (response.ok) {
          // Cache successful retry
          const cache = caches.open(API_CACHE);
          cache.then(c => c.put(request, response.clone()));
        }
        return response;
      })
    )
  );
}

async function getFailedRequests() {
  // Implementation would retrieve failed requests from IndexedDB
  return [];
}