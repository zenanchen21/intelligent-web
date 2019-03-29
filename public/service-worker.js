// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'socialData-v1';
var cacheName = 'socialPWA-step-8-1';
var filesToCache = [
    '/',
    '/scripts/app.js',
    '/stylesheets/inline.css',
    '/stylesheets/bootstrap.min.css',
    '/stylesheets/style.css',
    '/scripts/bootstrap.min.js',
    '/scripts/jquery.min.js',
    '/scripts/database.js'
];


/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * there are two main branches:
 * /weather_data posts cities names to get data about the weather from the server. if offline, the fetch will fail and the
 *      control will be sent back to Ajax with an error - you will have to recover the situation
 *      from there (e.g. showing the cached data)
 * all the other pages are searched for in the cache. If not found, they are returned
 */
self.addEventListener('fetch', function (e) {
  console.log('[Service Worker] Fetch', e.request.url);
  if(e.request.method != "POST"){
    e.respondWith(caches.match(e.request).then(function (response) {
      if (response)
        return response;
      var fetchRequest = e.request.clone();
      return fetch(fetchRequest).then(function (response) {
        // Check if we received a valid response. A basic response is one that
        // is made when we fetch from our own site. Do not cache responses to
        // requests made to other sites
        // if the file does not exist, do not cache - just return to the browser
        if (!response || response.status !== 200 ) {
          return response;
        }
        // response is valid. Cache the fetched file
        // IMPORTANT: as mentioned we must clone the response.
        // A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone();
        caches.open(cacheName).then(function (cache) {
          cache.put(e.request, responseToCache); // here we use the clone
        });
        return response; // here we use the original response
      });
    }));
  }
  else
    fetch(e.request).then(function (response) {
      // note: it the network is down, response will contain the error
      // that will be passed to Ajax
      return response;
    });
});
