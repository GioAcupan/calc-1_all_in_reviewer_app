// Offline support.
// App code (html/css/js/data): network-first with a 3 s timeout, falling back to cache — so a new
// deploy shows up immediately when online, and the app still opens with no connection.
// Vendored assets (KaTeX, fonts, icons): cache-first, they never change.
const VERSION = 'calc1-v12';
const CORE = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/mathenv.js', 'js/data/content.js', 'js/data/nota-extra.js', 'js/data/lhopital-routes.js',
  'js/data/bank-core-a.js', 'js/data/bank-core-b.js', 'js/data/bank-core-c.js', 'js/data/bank-core-d.js', 'js/data/bank-core-e.js',
  'js/data/bank-mock.js', 'js/data/bank-leithold.js', 'js/data/bank-peterson.js',
  'vendor/katex/katex.min.js', 'vendor/katex/katex.min.css',
  ...['Main-Regular', 'Main-Bold', 'Main-Italic', 'Math-Italic', 'Math-BoldItalic', 'AMS-Regular', 'Size1-Regular', 'Size2-Regular', 'Size3-Regular', 'Size4-Regular'].map((f) => `vendor/katex/fonts/KaTeX_${f}.woff2`),
  'vendor/fonts/bricolage-grotesque.woff2', 'vendor/fonts/jetbrains-mono.woff2',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
const IMMUTABLE = /\/vendor\/|\/icons\//;

self.addEventListener('install', (e) => {
  // cache: 'reload' bypasses the browser HTTP cache so the precache is never stale
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit && IMMUTABLE.test(req.url)) return hit;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 3000);
    try {
      const res = await fetch(req.url, { cache: 'no-cache', signal: ctl.signal });
      clearTimeout(timer);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch {
      clearTimeout(timer);
      return hit || (req.mode === 'navigate' ? (await cache.match('index.html')) || Response.error() : Response.error());
    }
  })());
});
