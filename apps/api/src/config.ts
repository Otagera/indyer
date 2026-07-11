export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "postgres://localhost:5432/indyer",
  resendApiKey: process.env.RESEND_API_KEY || "",
} as const;
