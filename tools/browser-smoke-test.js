"use strict";

const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const requestedUrl = process.argv[2] || "";
const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const remotePort = Number(process.env.CHROME_REMOTE_PORT || 9333);
const profileDir = path.join(os.tmpdir(), `roleta-browser-smoke-${Date.now()}`);

async function main() {
  const staticServer = requestedUrl ? null : await startStaticServer(process.cwd());
  const targetUrl = requestedUrl || staticServer.url;
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${profileDir}`,
    "--window-size=390,844",
    "--force-device-scale-factor=3",
    "about:blank"
  ], { stdio: "ignore" });

  try {
    await waitForChrome(remotePort);
    const pageTarget = await createPageTarget(remotePort);
    assert(pageTarget?.webSocketDebuggerUrl, "Chrome page target was not available");
    const cdp = await connectCdp(pageTarget.webSocketDebuggerUrl);

    const consoleErrors = [];
    const pageErrors = [];
    const badResponses = [];
    const failedRequests = [];

    cdp.on("Runtime.consoleAPICalled", (event) => {
      if (event.type === "error") {
        consoleErrors.push(event.args.map((arg) => arg.value || arg.description || "").join(" "));
      }
    });
    cdp.on("Runtime.exceptionThrown", (event) => {
      pageErrors.push(event.exceptionDetails?.text || event.exceptionDetails?.exception?.description || "page exception");
    });
    cdp.on("Network.responseReceived", (event) => {
      const status = event.response?.status || 0;
      if (status >= 400) badResponses.push(`${status} ${event.response.url}`);
    });
    cdp.on("Network.loadingFailed", (event) => {
      failedRequests.push(`${event.errorText || "failed"} ${event.requestId}`);
    });

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");
    await cdp.send("Log.enable");

    await navigate(cdp, targetUrl);
    await evaluate(cdp, async () => {
      localStorage.clear();
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    });
    await navigate(cdp, targetUrl);

    await waitFor(cdp, () => Boolean(document.querySelector("#age-screen.is-active")), 10000);
    await screenshot(cdp, "docs/screenshot-entry.png");

    await evaluate(cdp, () => {
      const solo = document.querySelector('input[name="gameMode"][value="solo"]');
      solo.checked = true;
      solo.dispatchEvent(new Event("change", { bubbles: true }));

      const rhythm = document.querySelector("#rhythm-select");
      rhythm.value = "slow";
      rhythm.dispatchEvent(new Event("change", { bubbles: true }));

      document.querySelector("#partner-one-name").value = "Teste";
      document.querySelector("#partner-one-name").dispatchEvent(new Event("input", { bubbles: true }));
      document.querySelector("#partner-one-pronoun").value = "feminine";
      document.querySelector("#adult-consent").checked = true;
      document.querySelector("#entry-form").requestSubmit();
    });

    await waitFor(cdp, () => Boolean(document.querySelector("#game-screen.is-active")), 10000);
  const session = await evaluate(cdp, () => JSON.parse(localStorage.getItem("roletaSensorial.session") || "{}"));
  assert(session.progressionMode === "slow", "selected progression mode was not saved to the session");

  await delay(2600);
  await screenshot(cdp, "docs/screenshot-wheel.png");

    await evaluate(cdp, () => document.querySelector("#spin").click());
    await waitFor(cdp, () => {
      const modal = document.querySelector("#result-modal");
      return modal && !modal.hidden;
    }, 9000);

    const resultText = await evaluate(cdp, () => document.querySelector("#result-text")?.textContent || "");
    assert(resultText && !/\{[a-z_]+\}/i.test(resultText), "result text contains an unreplaced token");
    await screenshot(cdp, "docs/screenshot-result.png");

    await delay(1500);
    await cdp.close();

    const ignorable = (entry) => /favicon\.ico/.test(entry);
    const relevantBadResponses = badResponses.filter((entry) => !ignorable(entry));
    const relevantFailedRequests = failedRequests.filter((entry) => !ignorable(entry));

    assert(!pageErrors.length, `page errors: ${pageErrors.join(" | ")}`);
    assert(!consoleErrors.length, `console errors: ${consoleErrors.join(" | ")}`);
    assert(!relevantBadResponses.length, `bad responses: ${relevantBadResponses.join(" | ")}`);
    assert(!relevantFailedRequests.length, `failed requests: ${relevantFailedRequests.join(" | ")}`);

    console.log(JSON.stringify({
      ok: true,
      screenshots: [
        "docs/screenshot-entry.png",
        "docs/screenshot-wheel.png",
        "docs/screenshot-result.png"
      ]
    }, null, 2));
  } finally {
    await stopProcess(chrome);
    if (staticServer) await closeServer(staticServer.server);
    try {
      fs.rmSync(profileDir, { recursive: true, force: true });
    } catch {
      // Windows may keep Chrome profile handles alive briefly after process exit.
    }
  }
}

function startStaticServer(rootDir) {
  const root = path.resolve(rootDir);
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://127.0.0.1");
    const pathname = decodeURIComponent(requestUrl.pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const filePath = path.resolve(root, relativePath);

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, { "Content-Type": getContentType(filePath) });
      response.end(content);
    });
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, url: `http://127.0.0.1:${address.port}/` });
    });
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".mp3": "audio/mpeg",
    ".txt": "text/plain; charset=utf-8"
  };
  return types[ext] || "application/octet-stream";
}

function connectCdp(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  const listeners = new Map();

  socket.addEventListener("message", (message) => {
    const payload = JSON.parse(message.data);
    if (payload.id && pending.has(payload.id)) {
      const { resolve, reject } = pending.get(payload.id);
      pending.delete(payload.id);
      if (payload.error) reject(new Error(payload.error.message));
      else resolve(payload.result);
      return;
    }

    if (payload.method && listeners.has(payload.method)) {
      listeners.get(payload.method).forEach((listener) => listener(payload.params || {}));
    }
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((innerResolve, innerReject) => {
            pending.set(id, { resolve: innerResolve, reject: innerReject });
          });
        },
        on(method, listener) {
          if (!listeners.has(method)) listeners.set(method, []);
          listeners.get(method).push(listener);
        },
        close() {
          socket.close();
        }
      });
    });
    socket.addEventListener("error", reject);
  });
}

async function navigate(cdp, url) {
  const navigation = await cdp.send("Page.navigate", { url });
  const expectedOrigin = new URL(url).origin;
  try {
    await waitForExpression(cdp, `location.origin === ${JSON.stringify(expectedOrigin)} && document.readyState !== "loading"`, 10000);
  } catch (error) {
    const currentUrl = await evaluateExpression(cdp, "location.href").catch(() => "unavailable");
    throw new Error(`Navigation failed; expected=${expectedOrigin}; current=${currentUrl}; result=${JSON.stringify(navigation)}; ${error.message}`);
  }
  await delay(1000);
}

async function evaluate(cdp, fn) {
  return evaluateExpression(cdp, `(${fn.toString()})()`);
}

async function evaluateExpression(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "evaluation failed");
  }
  return result.result?.value;
}

async function waitForExpression(cdp, expression, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await evaluateExpression(cdp, expression)) return;
    await delay(100);
  }
  throw new Error(`Timed out after ${timeoutMs}ms`);
}

async function waitFor(cdp, predicate, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await evaluate(cdp, predicate)) return;
    await delay(100);
  }
  throw new Error(`Timed out after ${timeoutMs}ms`);
}

async function screenshot(cdp, filePath) {
  const result = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true
  });
  fs.writeFileSync(filePath, Buffer.from(result.data, "base64"));
}

function once(cdp, method) {
  return new Promise((resolve) => cdp.on(method, resolve));
}

async function waitForChrome(port) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      await fetchJson(`http://127.0.0.1:${port}/json/version`);
      return;
    } catch {
      await delay(100);
    }
  }
  throw new Error("Chrome did not start in time");
}

async function createPageTarget(port) {
  try {
    return await fetchJson(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  } catch {
    const targets = await fetchJson(`http://127.0.0.1:${port}/json/list`);
    return targets.find((target) => target.type === "page");
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stopProcess(child) {
  return new Promise((resolve) => {
    if (!child || child.exitCode !== null) {
      resolve();
      return;
    }
    try {
      spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    } catch {
      // Fallback below covers environments without taskkill.
    }
    child.once("exit", resolve);
    child.kill();
    setTimeout(resolve, 2000);
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
