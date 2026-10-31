const CACHE_NAME = "daily-task-app-v3";

const FILES_TO_CACHE = [
"./",
"./index.html",
"./style.css",
"./script.js",
"./manifest.json",
"./icon-192.png",
"./icon-512.png"
];

// Install event
self.addEventListener("install", function(event) {


event.waitUntil(

    caches.open(CACHE_NAME).then(function(cache) {

        return cache.addAll(FILES_TO_CACHE);

    })

);

});

// Activate event
self.addEventListener("activate", function(event) {

event.waitUntil(

    caches.keys().then(function(cacheNames) {

        return Promise.all(

            cacheNames.map(function(cacheName) {

                if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                }

            })

        );

    })

);

});

// Fetch event
self.addEventListener("fetch", function(event) {

if (event.request.method !== "GET") {
    return;
}

event.respondWith(

    caches.match(event.request).then(function(response) {

        return response || fetch(event.request);

    })

);

});
