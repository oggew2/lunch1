// Service Worker for Kista Lunch App
const CACHE_NAME = 'kista-lunch-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/styles/components.css',
    '/js/app.js',
    '/js/state.js',
    '/js/fetchers/base.js',
    '/js/fetchers/kista.js',
    '/js/fetchers/courtyard.js',
    '/js/fetchers/timebuilding.js',
    '/js/utils/date.js',
    '/js/utils/cache.js',
    '/js/utils/errors.js',
    '/js/utils/foodCategories.js',
    '/js/components/header.js',
    '/js/components/footer.js',
    '/js/components/dateSelector.js',
    '/js/components/menuGrid.js',
    '/js/components/restaurantCard.js',
    '/js/components/progressPopup.js'
];

// Install - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch - stale-while-revalidate for API, cache-first for static
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // API requests: network first, cache fallback
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }
    
    // Static assets: cache first, network fallback
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            });
        })
    );
});
