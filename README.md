# TrueLabel

TrueLabel is a mobile app (iOS + Android) for India that shows independently
lab-tested scores for packaged food: a **Food Grade (A–F)**, a **Label
Accuracy Score (0–100)**, and a **Safety status** (Safe / Caution / Unsafe).

Full product and technical docs live in [`docs/`](docs/):

| Doc | Contents |
| --- | --- |
| [`docs/PRD.md`](docs/PRD.md) | Product requirements |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Stack, repo layout, database schema |
| [`docs/SCORING.md`](docs/SCORING.md) | Scoring algorithms and test vectors |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Design tokens, components, screens |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Build phases and task checklist |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Technical decision log |

See [`CLAUDE.md`](CLAUDE.md) for how this repo is built with Claude Code.

## Stack

Expo SDK 54 (React Native, TypeScript, Expo Router) for mobile, Supabase
(Postgres, Auth, Storage, RLS) as the backend, Next.js for the staff admin
panel, and a shared `packages/core` for types and the scoring engine. Full
detail in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Repository structure

```text
apps/
  mobile/      Expo SDK 54 app (iOS + Android)
  admin/       Next.js admin panel (staff only, from Phase 4)
packages/
  core/        Shared types + scoring engine (pure TypeScript)
supabase/      Migrations and seed data (from Phase 3)
docs/          Product and technical documentation
```

## Prerequisites

- Node.js **20.19.4+** (Node 22 LTS recommended)
- npm 10+
- An [Expo account](https://expo.dev/signup) (Expo Go requires sign-in)
- **Expo Go** installed on your iPhone from the App Store, showing **SDK 54**
  in its Settings/profile tab

## Setup

```bash
npm install                 # installs all workspaces
```

Copy the mobile env file and fill in values as needed (mock data source works
with no further setup):

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

## Commands

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

## Run on iPhone (Expo Go)

1. Install **Expo Go** from the App Store and sign in with an Expo account.
2. On your computer, run `npx expo login` with the same account.
3. Make sure the iPhone and computer are on the same Wi-Fi, then run
   `npm run mobile` from the repo root.
4. Scan the QR code shown in the terminal with the iPhone **Camera** app and
   open it in Expo Go.
5. If it can't connect (office/college Wi-Fi, firewall), run
   `npm run mobile:tunnel` instead.
6. Shake the phone to open the developer menu; press `r` in the terminal to
   reload.

## Project status

🚧 Early development — see [`docs/ROADMAP.md`](docs/ROADMAP.md) for current
phase and progress.
