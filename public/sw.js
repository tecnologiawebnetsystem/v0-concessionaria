// GT Veículos Admin PWA - Service Worker
const CACHE_NAME = "gt-admin-v1"

const PRECACHE_URLS = [
  "/admin",
  "/offline"
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  // Deixa passar todas as requisições normalmente
  // O service worker só garante suporte PWA + cache básico
  if (event.request.method !== "GET") return
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cacheia páginas do admin
        if (event.request.url.includes("/admin")) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {})
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => cached || caches.match("/offline"))
      })
  )
})
