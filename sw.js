/* Raspored časova — offline keš */
var VERZIJA = "raspored-v34";
var FAJLOVI = ["./", "./index.html", "./manifest.json", "./ikona-192.png", "./ikona-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(VERZIJA).then(function(k){ return k.addAll(FAJLOVI); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.map(function(x){ if(x !== VERZIJA) return caches.delete(x); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function(o){
      var kopija = o.clone();
      caches.open(VERZIJA).then(function(k){ k.put(e.request, kopija); });
      return o;
    }).catch(function(){
      return caches.match(e.request).then(function(o){ return o || caches.match("./index.html"); });
    })
  );
});
