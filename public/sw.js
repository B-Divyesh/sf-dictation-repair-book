const CACHE = 'drb-site-v5';
const PAGES = ['/', '/demo/', '/privacy/', '/terms/', '/404.html'];
const STATIC = ['/favicon.svg', '/apple-touch-icon.png', '/assets/hero-ledger-768.webp'];

async function precachePage(cache, path) {
  const response = await fetch(path, { cache: 'reload' });
  if (!response.ok) throw new Error(`Could not precache ${path}`);
  await cache.put(path, response.clone());
  const html = await response.text();
  const urls = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => new URL(match[1], self.location.origin))
    .filter((url) => url.origin === self.location.origin && !url.hash)
    .map((url) => url.pathname);
  await cache.addAll([...new Set(urls)]);
}

self.addEventListener('install', (event) => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(STATIC);
  await Promise.all(PAGES.map((path) => precachePage(cache, path)));
  await self.skipWaiting();
})()));

self.addEventListener('activate', (event) => event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
  await self.clients.claim();
})()));

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(new URL(event.request.url).pathname);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      void caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
      return response;
    } catch {
      if (event.request.mode === 'navigate') return (await caches.match('/404.html')) || Response.error();
      return Response.error();
    }
  })());
});
