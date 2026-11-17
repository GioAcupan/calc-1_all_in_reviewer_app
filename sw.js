// Offline-first service worker: precache the app shell, stale-while-revalidate everything else.
const VERSION = 'calc1-v3';
const CORE = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/mathenv.js', 'js/data/content.js', 'js/data/bank-core-a.js', 'js/data/bank-core-b.js', 'js/data/bank-core-c.js', 'js/data/nota-extra.js',
  'js/data/bank-mock.js', 'js/data/bank-leithold.js', 'js/data/bank-peterson.js', 'vendor/katex/katex.min.js', 'vendor/katex/katex.min.css',
  ...['Main-Regular', 'Main-Bold', 'Main-Italic', 'Math-Italic', 'Math-BoldItalic', 'AMS-Regular', 'Size1-Regular', 'Size2-Regular', 'Size3-Regular', 'Size4-Regular'].map((f) => `vendor/katex/fonts/KaTeX_${f}.woff2`),
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(VERSION).then(async (cache) => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
