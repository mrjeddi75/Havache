import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });

// app.js is already built (by esbuild) directly into public/ before this
// script runs. Copy the remaining static files as-is.
copyFileSync(join(root, "src/client/styles.css"), join(publicDir, "styles.css"));
copyFileSync(join(root, "src/client/favicon.svg"), join(publicDir, "favicon.svg"));
console.log("Copied styles.css -> public/styles.css");
console.log("Copied favicon.svg -> public/favicon.svg");

function hashOf(filePath) {
  const content = readFileSync(filePath);
  return createHash("sha1").update(content).digest("hex").slice(0, 8);
}

const appJsHash = hashOf(join(publicDir, "app.js"));
const stylesHash = hashOf(join(publicDir, "styles.css"));

let html = readFileSync(join(root, "src/client/index.html"), "utf8");
html = html
  .replace('href="/styles.css"', `href="/styles.css?v=${stylesHash}"`)
  .replace('src="/app.js"', `src="/app.js?v=${appJsHash}"`);

writeFileSync(join(publicDir, "index.html"), html);
console.log(`Wrote public/index.html (app.js?v=${appJsHash}, styles.css?v=${stylesHash})`);
