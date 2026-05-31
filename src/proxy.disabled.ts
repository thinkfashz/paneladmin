/**
 * Proxy Configuration (Disabled)
 *
 * This file contains a proxy setup that was used during development
 * to route API requests to a backend server. It’s disabled for now
 * but kept here for reference.
 *
 * To re-enable, rename this file to `proxy.ts` and update the port/target.
 */

const { createServer } = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const API_TARGET = "http://localhost:4000"; // Change to your backend URL

app.prepare().then(() => {
  createServer((req: any, res: any) => {
    if (req.url.startsWith("/api")) {
      createProxyMiddleware({
        target: API_TARGET,
        changeOrigin: true,
      })(req, res);
    } else {
      handle(req, res);
    }
  }).listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
