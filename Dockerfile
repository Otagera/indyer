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
CMD ["pnpm", "--filter", "@indyer/api", "dev"]

FROM base AS client
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN pnpm --filter @indyer/web build
EXPOSE 5173
CMD ["pnpm", "--filter", "@indyer/web", "preview"]
