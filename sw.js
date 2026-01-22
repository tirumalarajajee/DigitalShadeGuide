const CACHE_NAME = "shade-detector-v1";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./shades.json",
  "./js/jszip.min.js"
];

// Install: cache core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[SW] Caching core assets");
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for app files, network for others
self.addEventListener("fetch", event => {
  const req = event.request;

  // Do NOT interfere with camera, blobs, or media streams
  if (
    req.method !== "GET" ||
    req.url.startsWith("blob:") ||
    req.url.startsWith("mediastream:")
  ) {
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(req).then(response => {
        // Cache only same-origin successful responses
        if (
          response.ok &&
          req.url.startsWith(self.location.origin)
        ) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return response;
      });
    })
  );
});
