export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "postgres://localhost:5432/indyer",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  resendApiKey: process.env.RESEND_API_KEY || "",
} as const;
