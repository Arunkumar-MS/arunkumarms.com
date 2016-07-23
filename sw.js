\\welcome.[a-z0-9]*.sdfsdf.js

var urlsToCache = [
  '/arunkumarms.com/index.html',
  '/arunkumarms.com/stylesheets/stylesheet.css',
  '/arunkumarms.com/stylesheets/github-light.css',
  '/arunkumarms.com/stylesheets/normalize.css'
];
const CACHE_VERSION = 2;
let CURRENT_CACHES = {
  assets: 'my-v' + CACHE_VERSION
};
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CURRENT_CACHES.assets)
      .then(cache => {
        console.log('Opened cache',caches);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();

            caches.open(CURRENT_CACHES.assets)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
self.addEventListener('activate', event => {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  let expectedCacheNames = Object.keys(CURRENT_CACHES).map(key => {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
           console.log('Deleting out of date cache:', cacheName);
            console.log('expectedCacheNames cache:', expectedCacheNames);
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names,
            // then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
