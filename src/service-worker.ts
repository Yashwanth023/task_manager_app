
/// <reference lib="webworker" />

// Import mocked modules for development
import { core } from './mocks/workbox-mocks';
import { routing } from './mocks/workbox-mocks';
import { strategies } from './mocks/workbox-mocks';
import { precaching } from './mocks/workbox-mocks';
import { expiration } from './mocks/workbox-mocks';

declare const self: ServiceWorkerGlobalScope;

// Use core for app configuration
core.setCacheNameDetails({
  prefix: 'taskflow-app'
});

// Skip waiting and claim clients
core.skipWaiting();
core.clientsClaim();

// Mock manifest for development
const __WB_MANIFEST = [
  { url: '/', revision: '1' },
  { url: '/index.html', revision: '1' }
];

// Precache and route
precaching.precacheAndRoute(__WB_MANIFEST);
precaching.cleanupOutdatedCaches();

// Cache page navigations
routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new strategies.NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 50
      })
    ]
  })
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new strategies.StaleWhileRevalidate({
    cacheName: 'assets-cache',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 1 week
      })
    ]
  })
);

// Cache images with a Cache First strategy
routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
