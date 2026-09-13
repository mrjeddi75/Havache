import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import weatherRouter from "./routes/weather.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dist/server/index.js -> project root is two levels up.
const projectRoot = path.resolve(__dirname, "..", "..");
const publicDir = path.join(projectRoot, "public");

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.static(publicDir));
app.use("/api", weatherRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`سرور آب‌وهوا در حال اجراست: http://localhost:${port}`);
});
