
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/arunkumarms.com/stylesheets/sw.js',{scope:'/arunkumarms.com/stylesheets/'}).then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

var urlsToCache = [
        '/arunkumarms.com/stylesheets/stylesheet.css',
        '/arunkumarms.com/stylesheets/github-light.css',
        '/arunkumarms.com/stylesheets/normalize.css'
];
var CACHE_NAME = 'my-site-cache-v2';
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request);
     console.log(event.request.url);
     console.log(caches);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        console.log(event.request);
         console.log(event.request.url);
        
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

this.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v4'];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
