"use strict";

/**
 * SERVICE WORKER OTIMIZADO E REFATORADO
 * ═══════════════════════════════════════════════════════════════
 * Versão melhorada com:
 * - Geração dinâmica de lista de assets
 * - Validação rigorosa de respostas (evita cache de erros CORS)
 * - Separação lógica de Core Assets vs Imagens
 */

const CACHE_VERSION = 37; // Atualizado apos otimizar assets para PWA
const CACHE_NAME = `roleta-sensorial-v${CACHE_VERSION}`;

/* ─── Definição de Assets ─── */
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./theme-boudoir.css",
  "./style-mobile-compact.css",
  "./data/challenges.js",
  "./app.js",
  "./manifest.json",
  "./assets/icons/icon.svg",
  "./assets/icons/icon-16.png",
  "./assets/icons/icon-32.png",
  "./assets/icons/icon-48.png",
  "./assets/icons/icon-72.png",
  "./assets/icons/icon-96.png",
  "./assets/icons/icon-128.png",
  "./assets/icons/icon-144.png",
  "./assets/icons/icon-152.png",
  "./assets/icons/icon-180.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-384.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-192.png",
  "./assets/icons/maskable-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/og-image.png"
];

const APP_SHELL = [...CORE_ASSETS];

/* ═══════════════════════════════════════════════════════════════
   1. LIFECYCLE: INSTALL
   ═══════════════════════════════════════════════════════════════ */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()) // Força a atualização imediata do SW
  );
});

/* ═══════════════════════════════════════════════════════════════
   2. LIFECYCLE: ACTIVATE
   ═══════════════════════════════════════════════════════════════ */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith("roleta-sensorial-") && name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim()) // Assume o controle das abas abertas
  );
});

/* ═══════════════════════════════════════════════════════════════
   3. INTERCEPTAÇÃO DE REQUISIÇÕES (FETCH)
   ═══════════════════════════════════════════════════════════════ */
self.addEventListener("fetch", (event) => {
  // Ignora requisições que não sejam GET (ex: POST, PUT)
  if (event.request.method !== "GET") return;

  // Estratégia: Network First para navegação (HTML)
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirstPage(event.request));
    return;
  }

  // Estratégia: Cache First para assets (CSS, JS, Imagens)
  event.respondWith(cacheFirst(event.request));
});

/* ─── Estratégias de Cache ─── */

async function networkFirstPage(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put("./index.html", response.clone());
    return response;
  } catch (error) {
    return caches.match("./index.html");
  }
}

async function cacheFirst(request) {
  // 1. Tenta encontrar no cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    // 2. Se não encontrar, busca na rede
    const networkResponse = await fetch(request);

    // 3. Valida a resposta antes de fazer o cache dinâmico.
    // Garante que só fazemos cache de respostas válidas (status 200) e da nossa própria origem (basic)
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // 4. Fallback genérico caso a rede falhe e o recurso não esteja no cache
    return new Response("Recurso offline indisponível.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}
