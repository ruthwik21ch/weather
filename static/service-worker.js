const CACHE_NAME = "weather-app-v1";

const STATIC_ASSETS = [
  "/",
  "/static/manifest.json",
  "/static/icon.png",
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"
];

// ── INSTALL: cache all static assets ──────────────────────────────────────────
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: remove old caches ───────────────────────────────────────────────
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// ── FETCH: network-first for API, cache-first for static ──────────────────────
self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);

  // Always go network-first for weather POST requests (form submissions)
  if (event.request.method === "POST") {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match("/") || new Response(
          offlinePage(),
          { headers: { "Content-Type": "text/html" } }
        );
      })
    );
    return;
  }

  // Network-first for same-origin navigation (fresh weather data)
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          // Cache successful GET responses
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(function () {
          // Offline fallback: serve cached page
          return caches.match(event.request).then(function (cached) {
            return cached || new Response(
              offlinePage(),
              { headers: { "Content-Type": "text/html" } }
            );
          });
        })
    );
    return;
  }

  // Cache-first for external assets (fonts, icons)
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (response) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, clone);
        });
        return response;
      });
    })
  );
});

// ── OFFLINE FALLBACK PAGE ─────────────────────────────────────────────────────
function offlinePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather Dashboard — Offline</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0f1e;
      color: #f0f4ff;
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }
    .icon { font-size: 64px; margin-bottom: 24px; animation: float 3s ease-in-out infinite; }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    h1 {
      font-family: 'Syne', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff, #5ee7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 12px;
    }
    p { color: rgba(240,244,255,0.5); font-size: 15px; line-height: 1.6; max-width: 280px; }
    button {
      margin-top: 32px;
      background: linear-gradient(135deg, #5ee7ff, #a78bfa);
      color: #0a0f1e;
      border: none;
      border-radius: 12px;
      padding: 12px 28px;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="icon">🌩</div>
  <h1>You're Offline</h1>
  <p>No internet connection detected. Please check your network and try again.</p>
  <button onclick="window.location.reload()">Try Again</button>
</body>
</html>`;
}
