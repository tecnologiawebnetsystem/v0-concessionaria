// Concessionaria PWA - Service Worker Completo
const CACHE_NAME = "concessionaria-v2"

const PRECACHE_URLS = [
  "/",
  "/offline",
  "/veiculos",
  "/admin",
  "/manifest.json"
]

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  )
  self.skipWaiting()
})

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch - Network First com cache fallback
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return
  
  const url = new URL(event.request.url)
  
  // Ignorar API calls
  if (url.pathname.startsWith("/api/")) return

  // Imagens - Cache First
  if (event.request.destination === "image") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {})
          return response
        })
      })
    )
    return
  }

  // Paginas - Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {})
        return response
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => cached || caches.match("/offline"))
      })
  )
})

// Push Notifications
self.addEventListener("push", (event) => {
  if (!event.data) return
  const data = event.data.json()
  
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: { url: data.url || "/" },
    actions: [
      { action: "open", title: "Ver" },
      { action: "close", title: "Fechar" }
    ],
    tag: data.tag || "default",
    renotify: true
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification Click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  if (event.action === "close") return
  
  const url = event.notification.data?.url || "/"
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})

// Background Sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-favorites") {
    event.waitUntil(syncOfflineData())
  }
})

async function syncOfflineData() {
  // Sync offline favorites when back online
  console.log("Syncing offline data...")
}
