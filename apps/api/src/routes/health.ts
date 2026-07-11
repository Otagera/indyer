import type { HealthResponse } from "@indyer/shared";
import { Hono } from "hono";
import { getClient } from "../db/client.js";

const health = new Hono();

health.get("/", (c) => {
  let dbStatus: HealthResponse["db"] = "disconnected";
  try {
    const db = getClient();
    dbStatus = db ? "connected" : "disconnected";
  } catch {
    dbStatus = "error";
  }

  const response: HealthResponse = {
    status: "ok",
    db: dbStatus,
    uptime: process.uptime(),
  };

  return c.json(response);
});

export { health };
