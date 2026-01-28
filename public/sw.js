const CACHE_VERSIONS = {  
  static: 'static-v1',  
  models: 'models-v1',   
  runtime: 'runtime-v1'  
};  
  
const STATIC_ASSETS = [  
  '/',  
  '/index.html',  
  '/404.html',  
  '/vite.svg',  
];  
  
// Install event - cache static assets  
self.addEventListener('install', (event) => {  
  event.waitUntil(  
    caches.open(CACHE_VERSIONS.static)  
      .then((cache) => {
        return Promise.allSettled(
          STATIC_ASSETS.map((asset => 
            cache.add(asset).catch(err => {
              console.warn('Failed to cache ${asset}:', err);
              return null;
            })
          ))
        );
      })
      .then(() => self.skipWaiting())  
  );  
});  
  
// Activate event - clean old caches  
self.addEventListener('activate', (event) => {  
  event.waitUntil(  
    caches.keys().then((cacheNames) => {  
      return Promise.all(  
        cacheNames  
          .filter((cacheName) => !Object.values(CACHE_VERSIONS).includes(cacheName))  
          .map((cacheName) => caches.delete(cacheName))  
      );  
    }).then(() => self.clients.claim())  
  );  
});  
  
// Fetch event - implement caching strategies  
self.addEventListener('fetch', (event) => {  
  const { request } = event;  
  const url = new URL(request.url);  
  
  // Cache-first for models and WASM files  
  if (url.pathname.includes('.wasm') || url.pathname.includes('.model') || url.pathname.includes('models/')) {  
    event.respondWith(  
      caches.open(CACHE_VERSIONS.models).then((cache) => {  
        return cache.match(request).then((response) => {  
          if (response) return response;  
            
          return fetch(request).then((fetchResponse) => {  
            if (fetchResponse.ok) {  
              cache.put(request, fetchResponse.clone());  
            }  
            return fetchResponse;  
          });  
        });  
      })  
    );  
    return;  
  }  
  
  // Cache-first for static assets  
  if (request.destination === 'script' || request.destination === 'style' || request.destination === 'image') {  
    event.respondWith(  
      caches.open(CACHE_VERSIONS.static).then((cache) => {  
        return cache.match(request).then((response) => {  
          if (response) return response;  
            
          return fetch(request).then((fetchResponse) => {  
            if (fetchResponse.ok) {  
              cache.put(request, fetchResponse.clone());  
            }  
            return fetchResponse;  
          });  
        });  
      })  
    );  
    return;  
  }  
  
  // Network-first for documents and API  
  if (request.destination === 'document' || url.pathname.includes('/api/')) {  
    event.respondWith(  
      fetch(request).catch(() => caches.match(request))  
    );  
    return;  
  }  
  
  // Default: stale-while-revalidate  
  event.respondWith(  
    caches.open(CACHE_VERSIONS.runtime).then((cache) => {  
      return cache.match(request).then((cachedResponse) => {  
        const fetchPromise = fetch(request).then((networkResponse) => {  
          if (networkResponse.ok) {  
            cache.put(request, networkResponse.clone());  
          }  
          return networkResponse;  
        });  
          
        return cachedResponse || fetchPromise;  
      });  
    })  
  );  
});  
  
// Background sync  
self.addEventListener('sync', (event) => {  
  if (event.tag === 'sync-games') {  
    event.waitUntil(syncGames());  
  }  
});  
  
async function syncGames() {  
  console.log('Syncing offline game data...');  
}