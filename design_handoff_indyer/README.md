# Handoff: Indyer — daily guess-the-name puzzle (newsprint design)

## Overview
Indyer is a daily guessing game about notable Nigerians (leaders, musicians, footballers, writers). Everyone gets the same puzzle each day: six guesses, with a clue revealed after each miss. The visual language is a stylised newsprint homage — designed to be good enough for a Nigerian newspaper-archive data partnership, while deliberately NOT reading as a genuine archival clipping (invented masthead, issue number instead of a date, explicit disclaimer line).

The **share card is the product**: a torn strip of stylised newsprint the player pastes into WhatsApp after finishing.

## About the Design Files
The files in this bundle are **design references created in HTML** — an interactive prototype showing intended look and behavior, not production code to copy directly. Your task is to **recreate these designs in your codebase's environment** (React, Vue, Svelte, native, etc.) using its established patterns. If no environment exists yet, choose an appropriate stack (this is a mobile-first web game; a lightweight React/Preact or vanilla setup is a fine fit). The prototype file `Indyer v2.dc.html` uses a proprietary component runtime (`support.js`) — treat its template + logic as a readable spec, not as a framework to adopt.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are intentional. Recreate the UI pixel-close. The only placeholder content is the demo puzzle data (subject, clues, issue number) and the archive credit line, which awaits a real partnership.

## Design Tokens

### Colors
- Ink (near-black): `#141210`
- Paper (cream stock): `#efe6d0` — darker tint for docks/footers: `#e9dfc6`; lighter card fill: `#f5eeda`; brightest inset: `#faf5e6`
- Paper border/muted rules: `#cfc4a4`, `#b5aa8d`, disabled `#c2b797`
- Text secondary: `#3d372c`, tertiary/mono-muted: `#6b6250`, faint: `#867c65`, body: `#26221b`, italic muted: `#4d463a`
- Mode colors (spot inks): Easy green `#0e6b3f`, Normal gold `#c08a1e`, Hard red `#a92c1e` (red doubles as wrong-guess/corrections accent)
- App backdrop (behind the paper screens): `#171512` with faint gold radial glow `rgba(192,138,30,0.07)` and 22px dot grid `rgba(239,230,208,0.03)`

### Paper stock variants (tweakable)
- Fresh cream (default): bg `#efe6d0`, tint `#e9dfc6`
- Aged: bg `#e4d5b2`, tint `#dbc9a0`
- Bright white: bg `#f7f3e9`, tint `#ece7d8`

### Typography (Google Fonts)
- Masthead: **UnifrakturMaguntia** (blackletter), regular. Alternative tweak: Playfair Display 900 uppercase, letter-spacing 0.03em, ~76% of blackletter size
- Big numerals / reveal headline / drop quotes: **Playfair Display** 900
- Shouty labels, stamps, buttons: **Oswald** 600–700, uppercase, letter-spacing 0.08–0.34em
- Body/clues: **Old Standard TT** (regular + italic)
- Metadata/mono: **Courier Prime** (typewriter mono), letter-spacing 0.08–0.22em, mostly uppercase at 8–11px

### Texture & effects
- Paper grain: radial-gradient dots `rgba(20,18,16,0.05–0.06) 0.6px` on a 3px grid, opacity ~0.55, overlaid on every paper surface (pointer-events none)
- Tricolor press rule: 4px band split into three equal segments (green/gold/red) under a 2px black rule — appears under every masthead
- Hard shadows, not soft: `box-shadow: 2–4px 2–4px 0 <ink or mode color>` on interactive cards/buttons
- Screen cards: `box-shadow: 0 24px 44px rgba(0,0,0,0.5)`

## Screens / Views

All screens are 372–380px wide paper cards on the dark desk backdrop. Mobile-first; on a phone each screen is full-width.

### 1. Share card (the product)
A 372px-wide vertical strip of newsprint, rotated -0.8deg, with torn top/bottom edges (jagged clip-path polygon, ~17 points per edge) and heavy drop shadow.

Top to bottom:
- **Meta rule**: Courier 10px uppercase row — `No. 214` / `Six guesses` / mode name in mode color — above a 1px black rule
- **Masthead**: "The New Herald", blackletter 46px, centered
- **Disclaimer**: Courier 8.5px uppercase, letter-spacing 0.22em, `#6b6250`: "A daily guess-the-name puzzle · not an archival record" (must always be present — this is the archive-endorsement safeguard)
- **Tricolor press rule**
- **Headline zone** (flex row): left column has kicker "WHO IS IT?" (Oswald 12px, red, 0.26em), then two **redaction bars** — the signature element: 26px tall black bars (100% and 72% width), rotated -1.2deg, offset shadow `2px 2px 0 rgba(20,18,16,0.18)`, animating in with a scaleX wipe (0.5s/0.6s, staggered). Below: Courier 10px caption "NAME REDACTED · A WRITER · GUESS IN SIX". Right column: 92×110px "photograph withheld" box — halftone dot fill (two radial-gradient dot layers, 4px & 7px, over a warm gradient), 1px black border, caption below. An optional black censor bar across it is OFF by default (tweak `censorBar`)
- **Result band**: between 2px black rules — giant "3/6" (Playfair 900, 58px) + two-line Courier caption ("guessed on the third attempt"), and a rotated (-10deg) **ink stamp** of the mode name: 3px double border in mode color, Oswald 700 20px, mix-blend-mode multiply, opacity 0.92, stamping in with a scale-down animation (0.6s, 0.5s delay)
- **Surviving clue**: oversized Playfair quote mark in mode color + one italic Old Standard clue line, tagged "— SURVIVING CLUE" in Courier 9px
- **Credit rule**: 1px black rule; left = Courier 8px "FRONT PAGE STYLING — ARCHIVE CREDIT TO COME" (this is where archive attribution will sit), right = blackletter "indyer.app" with ".app" in mode color

**Export requirement**: in production this card must be rendered to an image (canvas or server-side) at ~4:5 portrait for WhatsApp sharing.

### 2. Mode select
380px paper card, min-height 740px, column flex.
- Same masthead block (40px) + tricolor rule
- Title "PICK YOUR EDITION" (Oswald 15px, 0.24em) + italic dek: "Six guesses either way. Fewer clues, harder read. Locks the moment you go to press."
- **Three mode cards** (Easy/Normal/Hard), each a flex row: a 56px **mini front-page thumbnail** (white paper, black masthead block, six 3px lines where visible clues are 35% gray and redacted ones solid black — the thumbnail literally visualizes clue count), then mode name (Oswald 700, 19px, in mode color), clue count (Courier 11px), and an italic one-line description. Card: 5px left border in mode color; unselected bg `#f5eeda` with `#b5aa8d` border; selected bg = mode color at 8% (`{color}14`), borders in mode color, `3px 3px 0 {color}` shadow
- Descriptions: Easy "All six clues on the table before you guess." / Normal "Four clues. A fair fight." / Hard "Two clues. Everything else is nerve."
- **Lock button** pinned to bottom: disabled state gray `#c2b797` "CHOOSE AN EDITION ABOVE"; enabled = mode color bg, `4px 4px 0 #141210` shadow, label "GO TO PRESS — {Mode}". Below: Courier 9.5px "ONE EDITION PER DAY · NO SWITCHING BACK"
- **Behavior**: mode locks for the day once pressed (persist per-day; prototype only locks for the session)

### 3. Play
- Header: Courier mode line in mode color ("No. 214 · HARD EDITION"), masthead 26px, and six **guess dots** right-aligned (11px circles: hollow 1.5px ink border = unused, mode color fill = correct, red fill = wrong)
- **Clue stack** (scrollable middle): each clue is a "torn clipping" — bg `#f5eeda`, 1px `#cfc4a4` border, alternating ±0.4–0.5deg rotation, `2px 2px 0 rgba(20,18,16,0.12)` shadow, big Playfair 900 30px clue number in mode color + Old Standard 14.5px text. New clues animate in (fade + 10px rise, 0.35s)
- **Corrections box** appears after first wrong guess: 1px black border, `#faf5e6` bg, red Oswald label "CORRECTIONS", wrong guesses listed in italic with red line-through — they stay visible all game
- **Input dock** pinned to bottom (`margin-top:auto`), tinted bg, 2px black top rule: Courier text input (2px black border, no right border) fused to a black "FILE IT" button (Oswald; hover = mode color). Below: "N GUESSES REMAINING" counter
- **Behavior**: Enter submits; empty input ignored; a wrong guess appends a strikethrough entry, fills a red dot, and reveals the next clue (mode base clues + 1 per miss, max 6); correct guess or 6th miss transitions to End (~250–450ms delay)

### 4. End / Reveal
- Full-width black banner: "EXTRA! EXTRA! — PUZZLE SOLVED" (win) or "LATE EDITION — THE ANSWER" (loss), Oswald 12px, 0.34em
- Result line in mode color ("No. 214 · Solved · 3/6"), then the subject's name as a giant Playfair 900 34px uppercase headline + italic dek ("Novelist and essayist · the writer behind No. 214"), tricolor rule
- **All six clues** listed, including never-seen ones: seen = 3px left border in mode color, transparent bg, tag "SEEN"; unseen = muted border `#c2b797`, tinted bg `#e9dfc6`, opacity 0.8, tag "LATE EDITION ONLY" — on Hard this reveal is the reward
- Footer dock: black "GET THE SHARE STRIP" button (hover = mode color) → share card; underlined Courier "Run it again" link

## Interactions & Behavior summary
- Mode choice is a daily commitment: chosen before any clue is visible, locked until the next puzzle day
- Guessing: 6 guesses in all modes; each miss reveals one more clue (capped at 6); wrong guesses persist as strikethrough "corrections"
- Name matching in the prototype is exact case-insensitive string equality — production should use fuzzy/alias matching (e.g. "Adichie" / "Chimamanda Adichie")
- Animations: redaction bars wipe in (scaleX, staggered), mode stamp slams in (scale 2.2→1 with rotation, 0.5s delay), clues rise in, screens rise in 0.4s
- The prototype's top tab bar (Share strip / Mode / Play / Reveal) is a **demo affordance only** — do not build it; real flow is Mode → Play → End → Share

## State Management
- `mode`: 'easy' | 'normal' | 'hard' (locked per day)
- `guesses`: array of `{ text, correct }` (max 6)
- `solved`: boolean
- Derived: `cluesShown = min(6, modeClueCount + wrongGuessCount)`
- Daily puzzle data per issue: `{ issueNo, subject, category, dek, clues[6] }` — clue order matters (vague → specific). Same puzzle for everyone each day; persist the player's day state locally so refresh doesn't reset it
- Share payload: issue number, mode, result fraction, one spoiler-free surviving clue, category line

## Tweakable design parameters (in the prototype's Tweaks panel)
- `disclaimer` (text): the masthead disclaimer line
- `censorBar` (boolean, default false): black bar across the withheld photo
- `masthead` (enum): Blackletter (default) vs Roman capitals
- `paperStock` (enum): Fresh cream (default) / Aged / Bright white

## Assets
No external images. Everything is drawn with CSS (halftone = layered radial-gradient dots; torn edges = clip-path; grain = dot pattern). Fonts from Google Fonts: UnifrakturMaguntia, Oswald, Old Standard TT, Courier Prime, Playfair Display.

## Constraints to preserve (from the product brief)
1. **Homage, not facsimile** — invented masthead ("The New Herald"), issue numbers instead of real dates, and the disclaimer line must survive any restyle. It must never look like a forged real front page.
2. **The redaction bar is the signature** — keep it black, keep it prominent.
3. **No Wordle-style colored squares** in the share output — the guess dots + newsprint strip are the identity.
4. The archive credit line placement is contractual real estate — keep it on the share card.

## Files
- `Indyer v2.dc.html` — the full interactive prototype (all four screens + logic). Template markup is inside `<x-dc>…</x-dc>`; the state machine is in the `<script data-dc-script>` block. Read it as a spec.
- `Indyer.dc.html` — earlier, more restrained design iteration (kept for reference)
- `support.js` — prototype runtime only; ignore for implementation
