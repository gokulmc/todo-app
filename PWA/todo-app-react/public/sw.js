// Version tag for this cache — bump this string (e.g. 'todo-pwa-v2') whenever
// you deploy new files so the activate step below knows to delete the old cache
const CACHE_NAME = 'todo-pwa-v1';

// INSTALL fires once when the browser downloads this SW for the first time
// (or when a new version of sw.js is detected)
self.addEventListener('install', event => {
  // waitUntil keeps the SW in the 'installing' state until the promise resolves —
  // if it rejects, the install fails and the old SW stays in control
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([
    // Pre-cache the app shell — '/' fetches index.html
    // Add more paths here (e.g. '/app.js', '/style.css') to pre-cache them too
    '/'
  ])));
  // By default a new SW waits until all tabs running the old SW are closed before taking over
  // skipWaiting() skips that wait and activates immediately after install
  self.skipWaiting();
});

// ACTIVATE fires after install, once the SW takes control
// This is the right place to clean up caches from old SW versions
self.addEventListener('activate', event => {
  event.waitUntil(
    // Get the names of every cache that currently exists
    caches.keys().then(keys =>
      Promise.all(
        // Keep only the current cache — delete everything else
        // This removes stale files left behind by previous SW versions
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  // By default the activated SW only controls pages opened AFTER it activates
  // clients.claim() makes it take control of all already-open tabs immediately
  self.clients.claim();
});

// FETCH fires on every network request made by pages this SW controls
self.addEventListener('fetch', event => {
  // respondWith() hijacks the request — whatever promise you pass resolves to the response
  event.respondWith(
    // Check if we already have this request stored in the cache
    caches.match(event.request).then(cached => {
      // Cache hit — return the stored response without touching the network
      if (cached) return cached;

      // Cache miss — go to the network
      return fetch(event.request).then(response => {
        // Don't cache bad responses, failed requests, or opaque cross-origin responses
        // (opaque = fetched without CORS headers — we can't inspect them safely)
        if (!response || response.status !== 200 || response.type === 'opaque') return response;

        // Responses are streams and can only be consumed once — clone before reading
        // One copy goes into the cache, the other is returned to the browser
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));

        // Return the original response to the page
        return response;
      });
    })
  );
});
