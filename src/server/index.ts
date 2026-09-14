import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import weatherRouter from "./routes/weather.js";
import highlightsRouter from "./routes/highlights.js";
import geocodeRouter from "./routes/geocode.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dist/server/index.js -> project root is two levels up.
const projectRoot = path.resolve(__dirname, "..", "..");
const publicDir = path.join(projectRoot, "public");

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(
  express.static(publicDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("index.html")) {
        // Entry point must always be revalidated so it picks up the
        // latest hashed asset URLs after a deploy.
        res.setHeader("Cache-Control", "no-cache");
      } else {
        // app.js/styles.css are requested with a content-hash query
        // string (see scripts/copy-static.mjs), so it's safe to cache
        // them aggressively — a new deploy gets a new URL.
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);
app.use("/api", weatherRouter);
app.use("/api", highlightsRouter);
app.use("/api", geocodeRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`سرور آب‌وهوا در حال اجراست: http://localhost:${port}`);
});
