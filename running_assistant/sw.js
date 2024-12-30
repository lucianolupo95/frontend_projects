self.addEventListener("install", (event) => {
  console.log("Service Worker instalado.");
});

self.addEventListener("fetch", (event) => {
  // Permite que la app funcione sin conexión
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
