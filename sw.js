const CACHE_NAME = 'doctor-biker-v31';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/script.js',
    './js/products.js',
    './js/translations.js',
    './boutique.html',
    './assets/logo.png',
    './assets/hero-bg.png',
    './assets/about-team-v2.jpg',
    './assets/brands-banner.png',
    './assets/gallery5.png',
    './assets/gallery6.jpg',
    './assets/gallery7.jpg',
    './assets/gallery8.png',
    './assets/gallery9.jpg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap'
];

// Install Event
self.addEventListener('install', event => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Fetch Event
self.addEventListener('fetch', event => {
    const url = event.request.url;

    // VERSIONED assets (script.js?v=30, style.css?v=30, etc.)
    // → Always go to network so code updates are immediate
    if (url.includes('?v=')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // HTML navigation requests → network-first so users always get fresh pages
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() =>
                caches.match(event.request) ||
                caches.match('./index.html')
            )
        );
        return;
    }

    // Everything else (images, fonts, icons) → cache-first
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// Activate Event (Cleanup old caches)
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
            // Tell the active service worker to take control of the page immediately.
            return self.clients.claim();
        })
    );
});
