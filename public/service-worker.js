// Service Worker for Gözcu Yazılım PWA - Optimized for Performance
const CACHE_NAME = 'gozcu-yazilim-v2';
const STATIC_CACHE = 'gozcu-static-v2';
const DYNAMIC_CACHE = 'gozcu-dynamic-v2';

// Critical resources to cache immediately
const urlsToCache = [
  '/',
  '/blog',
  '/logo.png',
  '/logo.webp', // WebP version
  '/manifest.json'
];

// Cache strategy: Cache First for static assets, Network First for API
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif|woff|woff2|ttf|eot)$/,
  /\/assets\//,
  /\/logo\./,
];

const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/v1\//, // Supabase API
];

// Install event - Cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(urlsToCache);
      }),
      self.skipWaiting() // Activate immediately
    ])
  );
});

// Fetch event - Optimized caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except same-origin)
  if (url.origin !== location.origin && !url.hostname.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    (async () => {
      // Check if it's a static asset (Cache First)
      const isStaticAsset = CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname));
      
      if (isStaticAsset) {
        // Cache First strategy for static assets
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.error('[SW] Fetch failed:', error);
          // Return offline fallback if available
          return new Response('Offline', { status: 503 });
        }
      }

      // Network First strategy for API calls
      const isApiCall = NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname));
      
      if (isApiCall) {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // Try cache as fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          throw error;
        }
      }

      // Default: Network First with cache fallback
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Offline', { status: 503 });
      }
    })()
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE];

  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim() // Take control of all pages immediately
    ])
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline form submissions
  return new Promise((resolve) => {
    // Implementation for syncing offline data
    resolve();
  });
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Yeni bir bildirim var!',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Görüntüle',
        icon: '/logo.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Gözcu Yazılım', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});




