# TrueLabel — Decision Log

Append new decisions at the bottom. Format: date · decision · why · alternatives considered.

| # | Date | Decision | Why | Alternatives |
| --- | --- | --- | --- | --- |
| 1 | 2026-09-27 | React Native with Expo + TypeScript for mobile | One codebase for iOS and Android, most widely used cross-platform stack, easy path to web/PWA | Flutter (Dart; weaker code sharing with web admin) |
| 2 | 2026-09-27 | Pin to **Expo SDK 54** | App Store Expo Go only runs SDK 54; user tests on iPhone via Expo Go | Latest SDK with `eas go` / TestFlight or dev builds (needs Apple Developer account) |
| 3 | 2026-09-27 | Supabase (Postgres, Auth, Storage, RLS) instead of a custom Node API for v1 | Removes most backend work; relational data fits; RLS enforces roles in the database | NestJS + RDS (more control, much more work) |
| 4 | 2026-09-27 | Scores computed only in admin panel server code using `packages/core` | Scores can never be forged from a client; one tested implementation | Postgres functions (harder to test), Edge Functions (Deno import friction with the monorepo) |
| 5 | 2026-09-27 | Email OTP sign-in until Phase 5 | Works in Expo Go without deep links or native modules | Magic links (need deep-link handling), Apple/Google (need dev build) |
| 6 | 2026-09-27 | Mock premium and push until Phase 5 | RevenueCat and remote push need a development build | — |
| 7 | 2026-09-27 | npm workspaces monorepo (`apps/mobile`, `apps/admin`, `packages/core`) | Share types and scoring engine; npm is the simplest for a solo developer | pnpm/yarn workspaces, separate repos |
| 8 | 2026-09-27 | Plain `StyleSheet` + tokens for styling | Zero extra config, no compatibility risk with Expo Go | NativeWind, Tamagui |
| 9 | 2026-09-27 | Fictional brands only in mock/seed data | Avoid publishing invented scores for real brands | — |
| 10 | 2026-09-27 | Branch per feature/fix (`feat/<name>` or `fix/<name>`); Claude Code never commits or pushes unless explicitly asked and confirmed | User keeps full control of git history | Auto-commit per task |
