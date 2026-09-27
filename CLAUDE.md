# CLAUDE.md — TrueLabel

This file is the entry point for Claude Code. Read it fully at the start of every session.

## What we are building

TrueLabel is a mobile app (iOS + Android) for India that shows independently lab-tested scores for packaged food. Every product has:

- **Food Grade (A–F)**: how good it is for you, based on *lab* values.
- **Label Accuracy Score (0–100)**: how closely the printed label matches the lab results.
- **Safety status**: Safe / Caution / Unsafe, based on FSSAI contaminant limits.

Staff buy products, send them to labs every 1–2 months, enter results in an admin panel, and publish scores after a second person reviews them.

## Source-of-truth documents (read before coding)

| File | What it holds |
| --- | --- |
| `docs/PRD.md` | Product requirements: users, roles, features, MVP scope |
| `docs/ARCHITECTURE.md` | Stack, repo layout, database schema, security rules, Expo Go constraints |
| `docs/SCORING.md` | Exact scoring algorithms and test vectors (implement exactly) |
| `docs/DESIGN.md` | Design tokens, components, screen specs |
| `docs/ROADMAP.md` | Build phases and task checklist. **Work through it in order.** |
| `docs/DECISIONS.md` | Log of technical decisions. Append new ones here. |

If documents conflict, precedence is: user instruction > DECISIONS.md > SCORING.md > ARCHITECTURE.md > PRD.md > DESIGN.md. Flag conflicts to the user; do not silently pick one.

## Hard constraints

1. **Expo SDK 54 only.** The user tests on a physical iPhone with the App Store version of **Expo Go**, which runs SDK 54. Newer SDKs will not load in it. Do not upgrade the SDK or React Native unless the user explicitly asks.
2. **Expo Go compatible until Phase 5.** Use only libraries bundled in Expo Go (the Expo SDK modules plus pure-JS packages). No custom native modules, no config plugins that require a native build, no `expo prebuild`. If a feature needs native code (RevenueCat, Google/Apple sign-in, remote push), stub it behind an interface and leave it for Phase 5.
3. **Install mobile dependencies with `npx expo install <pkg>`** (inside `apps/mobile`) so versions match SDK 54. Never hand-edit versions of `expo-*`, `react`, or `react-native`.
4. **Scores are computed only on the server / admin side**, never in the consumer app. The mobile app only reads published scores.
5. **Scores are never edited in place.** A correction inserts a new score row that supersedes the old one.
6. **Two-person rule.** The user who entered lab results cannot approve or publish them. Enforce this in the database, not just the UI.
7. **No real brand names in mock or seed data.** Use clearly fictional brands (e.g. "Demo Nutrition Co."). Publishing fake scores for real brands is a legal risk.
8. **No secrets in the repo.** Use `.env` files (git-ignored) and commit `.env.example` with placeholder values. Mobile public config uses the `EXPO_PUBLIC_` prefix.

## How to work

- Start each session by reading `docs/ROADMAP.md` and finding the first unchecked task.
- Before a phase, give the user a short plan (files to create or change, packages to add). Wait for approval if the phase adds dependencies or changes the database schema.
- Work in small steps. After each task: run the checks below, tick the box in `ROADMAP.md`, and stop for the user to review. Do not commit (see "Git rules").
- At the end of each phase, tell the user exactly how to see the result on their iPhone (see "Run on iPhone").
- If something is ambiguous, ask. Do not invent product rules; scoring rules come only from `docs/SCORING.md`.
- Record any non-obvious technical choice in `docs/DECISIONS.md` (date, decision, reason, alternatives).

## Git rules (strict)

1. **Never commit automatically.** The user commits manually. Do not run `git commit`, `git push`, `git merge`, `git rebase`, `git reset --hard`, `git stash` or any history-changing command on your own.
2. Only commit if the user explicitly asks in a message. Even then, first show the exact files to be staged and the commit message, and **wait for a clear "yes"** before running it. The same applies to pushing.
3. **Every feature or fix gets its own branch**, named `feat/<name-of-feature>` or `fix/<name-of-fix>` in lowercase kebab-case. Examples: `feat/food-grading-system`, `feat/barcode-scanner`, `fix/search-empty-results`.
4. Before starting work on a feature or fix, check the current branch with `git branch --show-current`. If it isn't the right branch, propose the branch name and the base branch (normally `main`) and wait for the user's approval before creating it with `git switch -c <branch>`.
5. Never work directly on `main`. If there are uncommitted changes when a new branch is needed, stop and ask the user what to do.
6. One branch = one feature or fix. If the work grows into a second feature, stop and propose a separate branch.
7. For work that is neither a feature nor a fix (docs-only, tooling, dependency bumps), ask the user which branch to use.
8. At the end of each task, give the user: the branch name, the list of changed files, and a suggested commit message. Nothing else happens in git.

## Commands (once scaffolded)

Run from the repo root unless noted.

```bash
npm install                        # install all workspaces
npm run mobile                     # start Expo dev server (apps/mobile)
npm run mobile:tunnel              # same, via tunnel if the phone can't reach the PC
npm run admin                      # start admin panel (apps/admin), Phase 4+
npm run test                       # unit tests (packages/core scoring engine)
npm run typecheck                  # tsc --noEmit across workspaces
npm run lint                       # eslint
cd apps/mobile && npx expo-doctor  # check dependency compatibility with SDK 54
```

## Definition of done (every task)

- `npm run typecheck` passes with zero errors (TypeScript `strict`).
- `npm run lint` passes.
- `npm run test` passes; scoring changes include tests that reproduce the vectors in `docs/SCORING.md`.
- `npx expo-doctor` reports no dependency issues (mobile tasks).
- The app still starts in Expo Go without a red screen (mobile tasks).
- ROADMAP checkbox ticked; changes left uncommitted for the user, with a suggested Conventional Commit message (`feat(mobile): …`, `fix(core): …`, `docs: …`) and the list of changed files.

## Run on iPhone (Expo Go)

1. Install **Expo Go** from the App Store and sign in with an Expo account (Expo Go requires login to run projects).
2. On the computer, run `npx expo login` with the same account.
3. The iPhone and computer must be on the same Wi-Fi. Run `npm run mobile`.
4. Scan the QR code with the iPhone **Camera** app and open it in Expo Go.
5. If it can't connect (office/college Wi-Fi, firewall), run `npm run mobile:tunnel` instead.
6. Shake the phone to open the developer menu; press `r` in the terminal to reload.

## Code conventions

- TypeScript everywhere, `strict: true`, no `any` (use `unknown` and narrow).
- Mobile: Expo Router (file-based routes under `apps/mobile/app/`), React Query for server data, Zustand for small client state, `StyleSheet` + theme tokens from `src/theme` (no inline magic colours or numbers).
- Components: function components, named exports, one component per file, `PascalCase.tsx`. Hooks: `useThing.ts`.
- All data access goes through repository interfaces in `apps/mobile/src/data/` so the mock and Supabase sources can be swapped with `EXPO_PUBLIC_DATA_SOURCE=mock|supabase`.
- Shared types and the scoring engine live in `packages/core` (pure TypeScript, no React, no I/O).
- Accessibility: every touchable has `accessibilityRole` and `accessibilityLabel`; grades are never conveyed by colour alone.
- Units: nutrients per 100 g; energy in kcal; sodium in mg; contaminants in mg/kg unless the parameter says otherwise.
- User-facing copy: calm, factual, no fear-mongering. Say "measured", "declared", "tested on <date>".
