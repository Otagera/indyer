import type { MiddlewareHandler } from "hono";

export const requestLogger: MiddlewareHandler = async (c, next) => {
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  console.log(`${c.req.method} ${c.req.path} ${c.res.status} ${duration.toFixed(0)}ms`);
};
