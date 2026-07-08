/* 집보기 체크앱 — 오프라인 셸 캐시. 배포 때마다 버전 올리면 자동 갱신됨 */
var CACHE = "jib-v2";
var ASSETS = ["./", "./index.html", "./supabase.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return; /* Supabase API 등은 항상 네트워크 */
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (r) {
      return r || fetch(e.request);
    })
  );
});
