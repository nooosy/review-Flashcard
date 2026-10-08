const V="fc-v3",F=["./","index.html","style.css","addon.css","extras.css","ui2.css","app.js","addon.js","extras.js","sync.js","manifest.json","decks/gwa.js","decks/earth.js","decks/soc.js","decks/feed-fx.js","decks/registry.js","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* 같은 사이트 파일만 캐시 (GitHub 동기화 요청 등 외부 주소는 건드리지 않음) */
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!="GET"||u.origin!==location.origin)return;
e.respondWith(caches.open(V).then(c=>c.match(e.request).then(m=>{const n=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>m);return m||n})))});
