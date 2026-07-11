import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "./config.js";
import { createClient } from "./db/client.js";
import { errorHandler } from "./middleware/error.js";
import { requestLogger } from "./middleware/logger.js";
import { identity } from "./middleware/identity.js";
import { warmFonts } from "./lib/fonts.js";
import { health } from "./routes/health.js";
import { puzzle } from "./routes/puzzle.js";
import { game } from "./routes/game.js";
import { auth } from "./routes/auth.js";
import { share } from "./routes/share.js";

const app = new Hono();

app.use("*", cors({ origin: "http://localhost:5173", credentials: true }));
app.use("*", requestLogger);
app.use("*", identity);

app.onError(errorHandler);

app.route("/health", health);
app.route("/puzzle", puzzle);
app.route("/game", game);
app.route("/auth", auth);
app.route("/share", share);

app.get("/", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Indyer</title>
  <style>
    body { margin: 0; background: #171512; color: #efe6d0; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; }
    main { text-align: center; }
    h1 { font-size: 2.5rem; margin: 0; }
    p { color: #867c65; }
  </style>
</head>
<body>
  <main>
    <h1>Indyer</h1>
    <p>Daily guess-the-name puzzle</p>
    <p><a href="/health" style="color:#c08a1e">/health</a></p>
  </main>
</body>
</html>`);
});

async function main() {
  try {
    createClient(config.databaseUrl);
    console.log("Database connected");
  } catch (e) {
    console.warn("Database not available yet:", (e as Error).message);
  }

  try {
    await warmFonts();
    console.log("Share card fonts loaded");
  } catch (e) {
    console.warn("Font loading failed:", (e as Error).message);
  }

  console.log(`Server starting on port ${config.port}`);
  serve({
    port: config.port,
    fetch: app.fetch,
  });
}

main().catch(console.error);
