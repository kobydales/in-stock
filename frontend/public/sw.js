// In-Stock service worker.
//
// Deliberately conservative: API calls (/api/*) are ALWAYS network-only —
// this app tracks live stock counts, so serving a cached/stale API
// response could show wrong quantities or let two people "successfully"
// sell the same last unit. Only the static app shell (HTML/CSS/JS/icons)
// is cached, so the app still loads to a usable screen when offline,
// rather than a blank white page.

const CACHE_NAME = 'in-stock-shell-v1'
const SHELL_ASSETS = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {
      // If pre-caching fails (e.g. dev server quirks), don't block install.
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Never cache API calls — always hit the network so stock data is
  // always current. If the network fails, let it fail (the app's own
  // offline banner + disabled write actions handle that gracefully).
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Only handle same-origin GET requests for the shell.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => cached) // offline: fall back to cache if we have it

      return cached || networkFetch
    })
  )
})
