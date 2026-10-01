// Offline cache for the web build (the Android wrapper bundles files locally).
const C = 'neta-v3';
const FILES = ['./', 'index.html', 'css/style.css', 'js/icons.js', 'js/data.js', 'js/art.js', 'js/engine.js', 'js/stage2.js', 'js/stage3.js', 'js/app.js', 'js/stage2-ui.js', 'js/stage3-ui.js', 'manifest.webmanifest', 'assets/icon.svg'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(e.request, cp)).catch(() => {}); return res; }).catch(() => r))));
