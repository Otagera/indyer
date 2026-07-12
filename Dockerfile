FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/ packages/
RUN pnpm install --frozen-lockfile
COPY . .

FROM base AS api
EXPOSE 3001
# Migrate on every boot (drizzle tracks applied migrations); seed only into
# an empty database — a full seed wipes puzzles mid-day for live players
CMD ["sh", "-c", "pnpm --filter @indyer/db db:migrate && SEED_IF_EMPTY=1 pnpm --filter @indyer/db db:seed && pnpm --filter @indyer/api dev"]

FROM base AS client
RUN pnpm --filter @indyer/web build
EXPOSE 5173
# "start" runs vite preview with --host --port 5173; bare "preview" binds
# localhost:4173 only, which Traefik (expecting 5173) answers with a 504
CMD ["pnpm", "--filter", "@indyer/web", "start"]
