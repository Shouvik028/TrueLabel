# TrueLabel — Architecture

## 1. Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Mobile app | **Expo SDK 54** (React Native 0.81, React 19.1), TypeScript, **Expo Router** | Pinned to SDK 54 so it runs in the App Store version of Expo Go (see §2) |
| Server data | `@tanstack/react-query` | Caching, retries, offline-friendly |
| Client state | `zustand` | Small stores only (onboarding, compare tray, dev flags) |
| Forms / validation | `react-hook-form` + `zod` | Zod schemas shared from `packages/core` |
| Styling | React Native `StyleSheet` + theme tokens | No CSS-in-JS library needed; keeps Expo Go compatibility simple |
| Icons | `@expo/vector-icons` | Bundled in Expo Go |
| Barcode | `expo-camera` (`CameraView` with `barcodeScannerSettings`) | Works in Expo Go |
| Local storage | `@react-native-async-storage/async-storage`, `expo-secure-store` (auth tokens) | Both in Expo Go |
| Backend | **Supabase**: Postgres, Auth, Storage, Row Level Security | No custom API server in v1 |
| Admin panel | **Next.js** (App Router) + TypeScript, `@supabase/ssr` | Web only, staff only. Computes and publishes scores server-side |
| Scoring engine | `packages/core` (pure TS) | Used by admin panel server code; unit-tested with Vitest |
| Payments | RevenueCat (Phase 5, needs development build) | Stubbed by a `PremiumService` interface until then |
| Push | `expo-notifications` remote push (Phase 5, development build) | Stubbed until then |
| Analytics / errors | PostHog, Sentry (Phase 6) | |
| Node | 20.19.4 or newer (Node 22 LTS recommended) | Required by React Native 0.81 |

## 2. Expo Go constraint (important)

The user tests on an iPhone using **Expo Go from the App Store**. As of mid-2026 the App Store build of Expo Go supports **SDK 54**; Expo Go builds for SDK 55–57 have not been approved on the App Store ([Expo changelog, May 2026](https://expo.dev/changelog/expo-go-and-app-store-may-2026), [SDK 57 notes](https://expo.dev/changelog/sdk-57)).

Therefore:

- Create the app with `npx create-expo-app@latest apps/mobile --template default@sdk-54`. The `expo` package must stay on `~54.x`.
- Before scaffolding, confirm the SDK shown in Expo Go on the iPhone (Expo Go → Settings / profile shows supported SDK). If it shows a different SDK, stop and tell the user.
- Phases 0–4 use only Expo Go-compatible modules.
- Phase 5 switches to **EAS development builds** (needs an Apple Developer account for iPhone installs). At that point the SDK can be upgraded, and native modules (RevenueCat, Apple/Google sign-in, push) are added. Any SDK upgrade is a user decision.

Features that need native code and how they are handled before Phase 5:

| Feature | Before Phase 5 (Expo Go) | Phase 5 (dev build) |
| --- | --- | --- |
| Sign-in | Supabase **email OTP** (6-digit code, no deep links) | Add Sign in with Apple, Google |
| Premium purchase | `MockPremiumService` + dev toggle in Profile → Developer | `RevenueCatPremiumService` |
| Push alerts | In-app notification list only | `expo-notifications` remote push |

## 3. Repository layout (npm workspaces monorepo)

```
TrueLabel/
├─ CLAUDE.md
├─ package.json              # workspaces + root scripts
├─ tsconfig.base.json
├─ .env.example
├─ docs/
├─ apps/
│  ├─ mobile/                # Expo SDK 54 app
│  │  ├─ app/                # Expo Router routes
│  │  │  ├─ _layout.tsx
│  │  │  ├─ onboarding/
│  │  │  ├─ (tabs)/          # home, search, scan, saved, profile
│  │  │  ├─ product/[id].tsx
│  │  │  ├─ compare.tsx
│  │  │  ├─ requests.tsx
│  │  │  ├─ paywall.tsx
│  │  │  ├─ methodology.tsx
│  │  │  └─ auth/
│  │  └─ src/
│  │     ├─ theme/           # tokens, useTheme
│  │     ├─ components/      # GradeBadge, ProductCard, …
│  │     ├─ data/            # repository interfaces + mock + supabase impls
│  │     │  ├─ types.ts
│  │     │  ├─ mock/         # fictional seed data (20 products)
│  │     │  └─ supabase/
│  │     ├─ services/        # PremiumService, NotificationService, AuthService
│  │     ├─ stores/          # zustand
│  │     └─ hooks/
│  └─ admin/                 # Next.js admin panel (Phase 4)
├─ packages/
│  └─ core/                  # shared types, zod schemas, scoring engine + tests
└─ supabase/
   ├─ migrations/            # SQL migrations, one per change
   ├─ seed.sql               # fictional demo data
   └─ config.toml
```

Root scripts: `mobile`, `mobile:tunnel`, `admin`, `test`, `typecheck`, `lint`.

Metro in SDK 54 detects monorepos automatically. If `packages/core` fails to resolve in Metro, add `watchFolders` in `apps/mobile/metro.config.js` and record it in `DECISIONS.md`.

## 4. Data access pattern (mobile)

```ts
// apps/mobile/src/data/types.ts (illustrative)
export interface ProductRepository {
  search(query: string, filters?: ProductFilters): Promise<ProductSummary[]>;
  getById(id: string): Promise<ProductDetail | null>;
  getByBarcode(barcode: string): Promise<ProductSummary | null>;
  listByCategory(categoryId: string, sort?: SortKey): Promise<ProductSummary[]>;
  getScoreHistory(productId: string): Promise<ScoreRecord[]>;   // premium
  getAlternatives(productId: string, limit: number): Promise<ProductSummary[]>;
}
```

- `EXPO_PUBLIC_DATA_SOURCE=mock` uses in-memory fictional data (Phases 1–2); `supabase` uses the real backend (Phase 3+).
- Screens call hooks (`useProduct(id)`, `useSearch(q)`), hooks call the active repository through React Query. Screens never import Supabase directly.

## 5. Database schema (Supabase / Postgres)

All tables have `id uuid primary key default gen_random_uuid()` unless noted, plus `created_at timestamptz default now()`.

### Enums

```sql
create type user_role      as enum ('user', 'lab_analyst', 'content_admin', 'super_admin');
create type product_status as enum ('draft', 'active', 'discontinued');
create type veg_mark       as enum ('veg', 'non_veg', 'none');
create type concern_level  as enum ('low', 'moderate', 'high');
create type param_kind     as enum ('nutrient', 'contaminant', 'allergen', 'microbial');
create type batch_status   as enum ('planned', 'purchased', 'at_lab', 'results_entered',
                                    'in_review', 'approved', 'rejected', 'published');
create type safety_status  as enum ('safe', 'caution', 'unsafe');
create type request_status as enum ('open', 'planned', 'tested', 'declined');
```

### Tables

| Table | Columns (beyond id, created_at) |
| --- | --- |
| `profiles` | `id uuid pk references auth.users`, `display_name`, `role user_role default 'user'`, `goals text[]`, `allergies text[]`, `consent_accepted_at timestamptz`, `deleted_at` |
| `subscriptions` | `user_id`, `plan text` (monthly/annual), `status text`, `store text` (app_store/play_store/mock), `started_at`, `expires_at`, `updated_at` |
| `brands` | `name unique`, `logo_url`, `country default 'IN'`, `website` |
| `categories` | `name`, `slug unique`, `parent_id`, `benchmarks jsonb` (see SCORING.md §4.1) |
| `products` | `brand_id`, `category_id`, `name`, `variant`, `pack_size text`, `image_urls text[]`, `test_frequency_months smallint check (in 1,2,3) default 2`, `status product_status default 'draft'`, `next_test_due date`, `search tsvector generated` (name + brand + variant) |
| `product_barcodes` | `barcode text primary key`, `product_id` — one product, many barcodes |
| `label_versions` | `product_id`, `version int`, `is_current bool`, `serving_size_g numeric`, `nutrients jsonb` (per 100 g, keys = parameter codes), `ingredients_text`, `allergens text[]`, `claims text[]`, `fssai_license_no text`, `veg_mark veg_mark`, `processing_level smallint check (1..4)`, `captured_at`, `photo_paths text[]` |
| `additives` | `name`, `e_number`, `concern concern_level`, `rationale`, `sources text[]` |
| `label_version_additives` | `label_version_id`, `additive_id` (pk both) |
| `labs` | `name`, `accreditation` (e.g. NABL), `contact` |
| `test_parameters` | `code text primary key` (e.g. `protein_g`, `lead_mg_kg`), `name`, `kind param_kind`, `unit`, `fssai_limit numeric null`, `limit_source text`, `category_overrides jsonb` |
| `test_batches` | `product_id`, `lab_id`, `label_version_id`, `cycle_number int`, `purchase_date`, `purchase_store`, `lot_number`, `expiry_date`, `status batch_status`, `entered_by uuid`, `reviewed_by uuid`, `review_notes` |
| `test_results` | `batch_id`, `parameter_code`, `value numeric`, `unit`, `method`, `below_detection bool default false`; unique (`batch_id`, `parameter_code`) |
| `lab_reports` | `batch_id`, `storage_path`, `uploaded_by`, `uploaded_at` |
| `scores` | `product_id`, `batch_id`, `label_accuracy numeric(4,1) null`, `accuracy_band text`, `grade char(1)`, `grade_composite numeric(4,1)`, `safety safety_status`, `breakdown jsonb`, `methodology_version text`, `published_at`, `approved_by`, `supersedes_id uuid null`, `correction_reason text null` |
| `favourites` | `user_id`, `product_id` (pk both) |
| `scan_history` | `user_id`, `barcode`, `product_id null`, `scanned_at` |
| `test_requests` | `product_name`, `brand_name`, `barcode`, `photo_path`, `requested_by`, `status request_status default 'open'`, `product_id null` |
| `test_request_votes` | `request_id`, `user_id`, `weight smallint` (1 free, 2 premium) — pk (`request_id`, `user_id`) |
| `notifications` | `user_id`, `type`, `product_id`, `payload jsonb`, `read_at` |
| `audit_log` | `actor_id`, `action`, `entity_type`, `entity_id`, `before jsonb`, `after jsonb` |

Indexes: GIN on `products.search`; btree on `product_barcodes.barcode` (pk), `scores (product_id, published_at desc)`, `test_batches (product_id, cycle_number)`.

### Views

- `product_public` — one row per active product with brand, category, image, **latest non-superseded published score** (grade, label_accuracy, accuracy_band, safety, published_at), `next_test_due`, and `is_stale` (`now() > next_test_due + 30 days`). Readable by `anon` and `authenticated`.
- `product_premium_detail` — label-vs-lab values, contaminant results, lab report path, score history. Readable only when `is_premium(auth.uid())`.

### Security rules (RLS)

- Helper functions: `current_role()` → `user_role` from `profiles`; `is_premium(uid)` → active row in `subscriptions` with `expires_at > now()`; `is_staff()` → role in (`lab_analyst`, `content_admin`, `super_admin`).
- Consumers: read `product_public`, `categories`, `brands`, `additives`, `test_parameters`. Read/write only their own `favourites`, `scan_history`, `notifications`, `profiles` (not the `role` column). Insert `test_requests` and `test_request_votes` as themselves.
- Premium: additionally read `product_premium_detail` and `lab_reports` storage objects (signed URLs).
- Lab analyst: insert/update `test_batches` and `test_results` where status < `in_review`; set `entered_by = auth.uid()`.
- Content admin: full write on catalogue tables; review batches; publish scores.
- Super admin: everything, including `profiles.role`.
- **No client role can insert or update `scores`** directly. Scores are written by the admin panel server code using a server-only Supabase secret key, after an authenticated content admin triggers publish.
- Trigger `enforce_two_person_rule`: blocks a `test_batches` status change to `approved` or `published` when `reviewed_by = entered_by` or `reviewed_by` is null.
- Trigger `scores_immutable`: blocks `update` and `delete` on `scores` (corrections insert a new row with `supersedes_id`).
- Triggers write `audit_log` rows for inserts/updates on catalogue, batch, result and score tables.

### Storage buckets

- `product-images` — public read.
- `label-photos` — staff only.
- `lab-reports` — private; premium users get short-lived signed URLs.
- `request-photos` — owner + staff.

## 6. Publish flow (admin panel)

1. Analyst creates a batch (product, lab, lot, purchase info) → enters results → uploads PDF → sets `results_entered`.
2. A different content admin opens the review screen: sees label vs lab, computed preview from `packages/core`, flags.
3. Approve → server action re-computes the score with `packages/core`, inserts a `scores` row (`methodology_version`), sets batch `published`, updates `products.next_test_due = purchase_date + test_frequency_months`, creates notifications for users who saved the product, writes audit log.
4. Reject → back to analyst with notes.

## 7. Environment variables

```
# apps/mobile/.env
EXPO_PUBLIC_DATA_SOURCE=mock          # mock | supabase
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=        # publishable key only

# apps/admin/.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=            # server only, never exposed to the browser
```

## 8. Testing strategy

- `packages/core`: Vitest unit tests; must include every vector in `SCORING.md` §6.
- Database: SQL tests (or a script) for RLS and the two-person trigger before Phase 4 is marked done.
- Mobile: typecheck, lint, `expo-doctor`, manual run in Expo Go on iPhone; add component tests later if needed.
