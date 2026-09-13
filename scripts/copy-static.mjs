import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });

const filesToCopy = [
  ["src/client/index.html", "public/index.html"],
  ["src/client/styles.css", "public/styles.css"],
  ["src/client/favicon.svg", "public/favicon.svg"],
];

for (const [src, dest] of filesToCopy) {
  copyFileSync(join(root, src), join(root, dest));
  console.log(`Copied ${src} -> ${dest}`);
}
