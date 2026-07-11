# Indyer — Agent Context

## Project
Daily guess-the-name puzzle about notable Nigerians. Newsprint-archive visual design. Monorepo at `/Users/OthnielAgera/source/personal_stuv/playground/Indyer`.

## Commands
```bash
pnpm dev              # Run API (3001) + Web (5173) in parallel
pnpm lint             # Biome check
pnpm typecheck        # Run tsc --noEmit across all packages
pnpm -r test          # Run vitest across all packages
pnpm --filter @indyer/db exec tsx src/seed.ts   # Re-seed DB
pnpm --filter @indyer/db exec tsx src/migrate.ts # Run pending migrations
```

## Progress

### Done
- IND-0a: Root scaffold (pnpm workspace, tsconfig.base, biome, .gitignore, .env.example, shared types)
- IND-0a: apps/api (Hono + @hono/node-server, health route, CORS, logger, error handler)
- IND-0a: apps/web (Vite + React + Tailwind v4 + Zustand + HealthCheck, Vite proxy /api → :3001)
- IND-0b: docker-compose.yml, packages/db (Drizzle schema, migration config, seed stub)
- IND-0c: Walking skeleton verified (boots, /health works, proxy works, typecheck clean)
- IND-0d: Google Fonts, Tailwind v4 @theme, 6 base components (PaperGrain, Masthead, Button, Card, Input, GuessDot), shared theme tokens
- IND-0e: Root Dockerfile (multi-stage api+client), docker-compose with 3 services + Traefik, deploy workflow
- IND-1: Roster schema (subjects, clues), seed 10 subjects with 6 clues
- IND-2: 30 subjects with 180 clues across 6 categories
- IND-3: Daily puzzle selection (mulberry32 PRNG, hashSeed, puzzle-selector, upsert puzzle)
- IND-4: Identity middleware (httpOnly cookie, playerId for all routes)
- IND-5: Auth routes (magic link with 8-char code, 15-min expiry, Resend in prod / console.log in dev)
- IND-6: GET /game/today (status: new/started/solved/failed, clues up to budget, never leaks answer)
- IND-7: POST /game/start (mode selection, clue budget per mode, 409 on re-start)
- IND-8: POST /game/guess (fuzzy match with Levenshtein ≤2, clue budget, answer on gameOver)
- IND-9: Game state persistence (game_states table, unique on playerId+issueNo, refresh restores)
- IND-10: Mode select screen (3 cards with accents, clue badges, dare taglines)
- IND-11: Play screen (wrong guesses strikethrough, guess dots, clue exhaustion, typeahead datalist)
- IND-12: End screen (answer + category badge + full 6 clues with unseen divider + stats)
- IND-13: Typeahead (30-name roster from GET /today, native `<datalist>`)
- IND-14: Server-rendered share card (SVG + @resvg/resvg-js PNG at GET /share/card, newsprint design, redaction bar in mode color)
- IND-15: Share flow (ShareButton component, Web Share API → clipboard → text fallback)
- IND-16: Source-shaped clue slot (source credit in ClueBox, Murtala Mohammed clues 2 & 6 sourced with real NYT citations)
- Migration 0001 (clues_revealed column, unique index, auth tables)
- 37 API tests, 10 DB tests, 33 web tests, 8 shared tests
- `AGENTS.md` created for agent context

### In Progress
- (none)

### Blocked
- (none)

## Architecture
- **API**: apps/api (Hono + tsx watch), uses `getClient()` for Drizzle ORM
- **Web**: apps/web (Vite + React + Zustand + Tailwind v4), fetches /api/* via Vite proxy
- **Shared**: packages/shared (types: Mode, Category, ClueItem, Guess, TodayResponse, StartResponse, GuessResponse, ClueSource)
- **DB**: packages/db (Drizzle schema, puzzle-selector, seed from roster.json)

## Key Decisions
- Default DATABASE_URL: `postgres://localhost:5432/indyer`
- Mode budgets: Easy=6 clues/6 guesses, Normal=4/6, Hard=2/6
- DOM cleanup: `afterEach(cleanup)` in `apps/web/src/test-setup.ts`
- Drizzle table name identified via `Symbol.for("drizzle:Name")` (not `.name`)
- Share card uses SVG template + @resvg/resvg-js (not satori)
- Share card redaction bar uses mode color (easy=green, normal=amber, hard=red)
- Share fallback text: "Play Indyer at indyer.otagera.xyz"
- Murtala Mohammed's clues 2 and 6 have real NYT source citations (for the pitch)
- Source credit only shown for clues that have source populated (source: null → plain clue)

## Relevant Files
- `apps/api/src/routes/game.ts` — core game endpoints
- `apps/api/src/routes/share.ts` — share card PNG endpoint
- `apps/api/src/lib/share-card.ts` — SVG template generator
- `apps/api/src/lib/fonts.ts` — Google Font download + cache
- `apps/web/src/components/GameOver.tsx` — end screen with ShareButton
- `apps/web/src/components/ShareButton.tsx` — share flow (Web Share → clipboard → text)
- `apps/web/src/components/ClueBox.tsx` — clue display with source credit
- `packages/shared/src/api.ts` — API response types (ClueItem has source)
- `packages/db/src/roster.json` — 30 subjects, Murtala clues 2 & 6 have source
- `packages/db/src/schema.ts` — clues.source is jsonb, nullable
- `packages/db/src/seed.ts` — passes source field to insert
