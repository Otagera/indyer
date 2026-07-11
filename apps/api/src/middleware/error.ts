import type { ErrorHandler } from "hono";

export const errorHandler: ErrorHandler = (err, c) => {
  console.error("Unhandled error:", err);
  return c.json(
    {
      error: err.message || "Internal server error",
      code: "INTERNAL_ERROR",
    },
    500,
  );
};
