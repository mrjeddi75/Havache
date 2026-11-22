import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
mkdirSync(dist, { recursive: true });

// dist/app.js is already built by esbuild. Copy the remaining static files.
copyFileSync(join(root, "src/client/styles.css"), join(dist, "styles.css"));
copyFileSync(join(root, "src/client/favicon.svg"), join(dist, "favicon.svg"));
// Tell GitHub Pages not to run Jekyll over the output.
writeFileSync(join(dist, ".nojekyll"), "");

const hashOf = (file) => createHash("sha1").update(readFileSync(file)).digest("hex").slice(0, 8);
const appHash = hashOf(join(dist, "app.js"));
const cssHash = hashOf(join(dist, "styles.css"));

// Content-hash query strings bust browser caches on every deploy. Paths stay
// relative (./) so the site works both at a domain root and under /repo-name/.
let html = readFileSync(join(root, "src/client/index.html"), "utf8");
html = html
  .replace('href="./styles.css"', `href="./styles.css?v=${cssHash}"`)
  .replace('src="./app.js"', `src="./app.js?v=${appHash}"`);
writeFileSync(join(dist, "index.html"), html);
console.log(`dist/ ready (app.js?v=${appHash}, styles.css?v=${cssHash})`);
