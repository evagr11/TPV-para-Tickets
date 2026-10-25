/* Service worker: guarda la app en el móvil para que abra aunque no haya cobertura.
   Primero intenta la red (para recibir cambios de precios o productos) y, si no hay
   conexión, usa la copia guardada. Si cambias la lista de archivos, sube la versión. */
const VERSION = "barra-v1";
const ARCHIVOS = ["./", "index.html", "style.css", "script.js", "manifest.webmanifest",
  "icons/icono-192.png", "icons/icono-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((respuesta) => {
        if (respuesta.ok) {
          const copia = respuesta.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copia));
        }
        return respuesta;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
