/* FlyFit: retira el service worker de versiones anteriores para que el teléfono
   cargue siempre la versión publicada. No guarda ni borra datos personales
   (los registros viven en el almacenamiento local de la página, no en esta caché). */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) await caches.delete(k);
    await self.registration.unregister();
    for (const c of await self.clients.matchAll({type:"window"})) c.navigate(c.url);
  })());
});
