// Should be updated everytime you update pruduction
const currentCacheName = 'ci-build-v1';

const getCacheFirst = (request) => {
  return caches.match(request).then(function(response) {
    if (response) {
      return response;
    } else {
      return fetch(request).then((response) => {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        const responseClone = response.clone();

        caches.open(currentCacheName).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    }
  });
};

const isCacheFistResource = (url) => {
  if (url.pathname === '/sockjs-node/info' || /^\/api\//.test(url.pathname)) {
    return false;
  }
  return true;
};

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(currentCacheName));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.filter((cacheName) => currentCacheName !== cacheName)
                .map((cacheName) => caches.delete(cacheName))
        );
      })
  );
});

self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);
  if (isCacheFistResource(requestUrl)) {
    event.respondWith(getCacheFirst(event.request));
  }
});

self.addEventListener('message', ({data}) => {
  switch ( data.type ) {
    case 'SKIP_WAITING':
      self.skipWaiting();
    default:
      return;
  }
});
