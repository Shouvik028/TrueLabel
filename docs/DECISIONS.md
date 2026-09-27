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
| 11 | 2026-09-27 | `computeSafety` and `computeFoodGrade` return a discriminated union (`{ok:true,...}\|{ok:false,error}`) instead of throwing on insufficient data | Forces every caller (admin panel, tests) to handle the missing-data case at compile time, per SCORING.md's "return error X" wording | Throw and let callers catch; return nullable fields |
| 12 | 2026-09-27 | Added `INSUFFICIENT_CONTAMINANT_DATA` error to `computeFoodGrade` for when no contaminant carries an FSSAI limit; publishing itself requires a limited contaminant (SCORING.md §2), so this only fires when Food Grade is computed standalone | SCORING.md defined `INSUFFICIENT_NUTRITION_DATA` and `INSUFFICIENT_SAFETY_DATA` but left §4.2's no-limit case unhandled | Silently return C=100 or 0 |
| 13 | 2026-09-27 | `packages/core` domain types (`Product`, `LabelVersion`, etc.) use camelCase fields, distinct from the snake_case DB columns in ARCHITECTURE.md §5 | Idiomatic TypeScript; keeps the scoring engine and mobile/admin code consistent. Mapping to/from Supabase rows is a repository-layer concern in later phases | Mirror DB snake_case in shared types |
| 14 | 2026-09-27 | `computeFoodGrade`'s `processingLevel` input is required (non-nullable); scoring functions throw a plain `Error` on negative, NaN or Infinity numeric inputs | `label_versions.processing_level` has no spec'd fallback and is check-constrained to 1–4; invalid numeric input is a data bug upstream, not a business outcome the type system should model as a domain result | Make processingLevel optional with a default; return an error variant for invalid numbers |
