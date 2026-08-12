import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const HOST = "127.0.0.1";
const requestedPort = Number(process.env.TEST_SERVER_PORT || process.argv[2] || 4321);
const PORT = Number.isInteger(requestedPort) && requestedPort > 0 ? requestedPort : 4321;
const DIST = path.resolve("dist");
const basePath = (process.env.PUBLIC_BASE_PATH || "/").replace(/\/+$/, "") || "/";
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8"
};

function responsePath(rawUrl) {
  const pathname = decodeURIComponent(new URL(rawUrl, `http://${HOST}`).pathname);
  if (basePath !== "/" && pathname !== basePath && !pathname.startsWith(`${basePath}/`)) return null;
  const relative = basePath === "/" ? pathname.slice(1) : pathname.slice(basePath.length).replace(/^\//, "");
  let candidate = path.resolve(DIST, relative || "index.html");
  if (!candidate.startsWith(DIST)) return null;
  return candidate;
}

const server = createServer(async (request, response) => {
  let candidate = responsePath(request.url || "/");
  if (candidate && existsSync(candidate) && (await stat(candidate)).isDirectory()) candidate = path.join(candidate, "index.html");
  if (candidate && !path.extname(candidate) && existsSync(path.join(candidate, "index.html"))) candidate = path.join(candidate, "index.html");

  if (!candidate || !existsSync(candidate)) {
    candidate = path.join(DIST, "404.html");
    response.statusCode = 404;
  }

  response.setHeader("Content-Type", mimeTypes[path.extname(candidate).toLowerCase()] || "application/octet-stream");
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(candidate).pipe(response);
});

server.listen(PORT, HOST, () => {
  console.log(`Static test server listening at http://${HOST}:${PORT}${basePath}/`);
});
