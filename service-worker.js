const CACHE_NAME = 'bobici-v1';
const urlsToCache = [
  '/sprites/',
  '/sprites/index.html',
  '/sprites/manifest.json',
  '/sprites/sprites/bee.png',
  '/sprites/sprites/cactus.png',
  '/sprites/sprites/cat.png',
  '/sprites/sprites/chameleon.png',
  '/sprites/sprites/chocolate.png',
  '/sprites/sprites/flower.png',
  '/sprites/sprites/ice_cream.png',
  '/sprites/sprites/lemon.png',
  '/sprites/sprites/rasberry.png',
  '/sprites/sprites/snail.png',
  '/sprites/sprites/sponge_bob.png',
  '/sprites/sprites/sushi.png',
  '/sprites/sprites/toast.png',
  '/sprites/sprites/whale.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it can only be used once
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});
