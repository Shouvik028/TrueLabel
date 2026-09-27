# TrueLabel — Design Spec

Goal: a lab report that reads in three seconds. **Verdict first, evidence one tap below.**

## 1. Principles

1. **Verdict first.** Every product card and page leads with Food Grade, Label Accuracy and Safety status.
2. **Show the evidence.** Every score links to how it was calculated and the lab result behind it. The test date is always visible.
3. **Never colour alone.** Grades show colour + letter + word ("A · Excellent"); safety shows icon + word.
4. **Calm, clinical tone.** White space, neutral language, no alarm styling except for Unsafe.
5. **Fast paths.** Scan is one tap from every tab. Search remembers recent queries.
6. **Honest paywall.** Free information is never hidden; Premium sections show a blurred preview with a clear lock.

## 2. Tokens

The base palette, grade colours, safety colours and label-accuracy-band colours are defined once in `packages/core/src/theme/colors.ts` (light + dark, plus a `contrastRatio` helper and a Vitest suite asserting every pair below is ≥ 4.5:1), so the admin panel can reuse the exact same values. `apps/mobile/src/theme/tokens.ts` imports that palette and adds spacing, radius and the type scale, which stay mobile-only.

### Colour (light / dark)

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `bg` | `#FFFFFF` | `#0F1113` | Screen background |
| `surface` | `#F5F6F7` | `#1A1D20` | Cards |
| `surfaceRaised` | `#FFFFFF` | `#23272B` | Sheets, modals |
| `border` | `#E3E5E8` | `#2E3338` | Dividers |
| `text` | `#111418` | `#F2F4F5` | Primary text |
| `textMuted` | `#5B6470` | `#A3ACB6` | Secondary text |
| `accent` | `#0F766E` | `#2DD4BF` | Brand, primary buttons, links |
| `accentOn` | `#FFFFFF` | `#04211F` | Text on accent |
| `premium` | `#7C3AED` | `#A78BFA` | Premium lock / badge |

### Grade scale

| Grade | Word | Fill | Text on fill |
| --- | --- | --- | --- |
| A | Excellent | `#1B7F3B` | `#FFFFFF` |
| B | Good | `#4D7C0F` | `#FFFFFF` |
| C | Fair | `#CA8A04` | `#111418` |
| D | Poor | `#EA7A1A` | `#111418` |
| E | Very poor | `#C2410C` | `#FFFFFF` |
| F | Avoid | `#B42318` | `#FFFFFF` |

Add a unit test that checks each fill/text pair has a contrast ratio ≥ 4.5:1 and adjust shades if not.

### Safety

| Status | Icon (Ionicons) | Colour (light) | Colour (dark) |
| --- | --- | --- | --- |
| Safe | `shield-checkmark` | `#1B7F3B` | `#34D399` |
| Caution | `alert-circle` | `#B45309` | `#FBBF24` |
| Unsafe | `close-circle` | `#B42318` | `#F87171` |
| Not assessed | `help-circle` | `textMuted` | `textMuted` |

The light shades are rendered as icon/text colour directly on `bg`/`surface` and only clear 4.5:1 against the light palette (2.9–3.8:1 against dark `bg`/`surface`). The dark column above is lightened tints of the same hue, added so the same rule holds in dark mode; verified by the Vitest suite in `packages/core/src/theme/colors.test.ts`.

### Label accuracy bands

| Band | Colour (light) | Colour (dark) |
| --- | --- | --- |
| Accurate | `#1B7F3B` | `#34D399` |
| Minor gaps | `#4D7C0F` | `#A3E635` |
| Misleading | `#B45309` | `#FBBF24` |
| Inaccurate | `#B42318` | `#F87171` |

Same dark-mode contrast fix as Safety above. Always show the number and the band word.

### Type, spacing, shape

- System font. Scale: `display 32/38 bold`, `title 22/28 semibold`, `heading 17/22 semibold`, `body 15/22`, `caption 13/18`, `micro 11/14`. Respect Dynamic Type (`allowFontScaling` on; test at largest size).
- Spacing: 4-pt grid — `xs 4, sm 8, md 12, lg 16, xl 24, xxl 32`. Screen gutter 16.
- Radius: `sm 8, md 12, lg 16, pill 999`.
- Touch targets ≥ 44 × 44 pt.
- Elevation: subtle border in light mode; no heavy shadows.

## 3. Components (`apps/mobile/src/components/`)

| Component | Description |
| --- | --- |
| `GradeBadge` | Rounded square with letter; sizes sm (28), md (44), lg (72); optional word below |
| `AccuracyMeter` | Number (0–100) + horizontal bar + band word; "Not enough data" state |
| `SafetyPill` | Icon + status word pill |
| `FreshnessTag` | "Tested 12 Aug 2026" or "Stale — retest overdue" |
| `ProductCard` | Image, brand, name, variant; right side: GradeBadge sm + accuracy number + SafetyPill icon |
| `ScoreHeader` | Product page hero: image, names, the three verdicts side by side, freshness |
| `KeyFindings` | 2–4 plain-language bullets generated from the breakdown (e.g. "Protein 16% lower than label") |
| `LabelVsLabTable` | Rows: nutrient · label · lab · difference % with direction arrow and harmful highlight |
| `AdditiveRow` | Name, E-number, concern chip (low/moderate/high), tap for rationale |
| `ContaminantRow` | Name, measured value, limit, % of limit bar |
| `ScoreHistoryChart` | Simple line/step of composite and LAS across cycles (use `react-native-svg`, which is in Expo Go) |
| `PremiumLock` | Blurred/dimmed preview + lock icon + "Unlock with Premium" button |
| `EmptyState` | Icon, title, message, optional action |
| `SearchBar`, `FilterChips`, `SortMenu` | Search and filters |
| `ScanButton` | Prominent centre tab button |
| `Skeleton` | Loading placeholders for cards and product page |

Every component: light/dark support, accessibility label, loading and error state where relevant.

## 4. Navigation

Bottom tabs: **Home · Search · Scan (centre, raised) · Saved · Profile**.
Stack routes: `product/[id]`, `compare`, `requests`, `paywall` (modal), `methodology`, `auth/*`, `onboarding/*`.

## 5. Screens

| # | Screen | Content | States |
| --- | --- | --- | --- |
| 1 | Onboarding (3 slides) | What the grade means · what label accuracy means · "every result is from a real lab test" | Skip, continue |
| 2 | Goal picker | Chips: high protein, low sugar, low sodium, additive-free, kid-safe | Optional |
| 3 | Home | Search bar, scan shortcut, "Recently tested" carousel, "Top in <category>" lists, "Most requested" teaser | Loading skeleton, offline banner |
| 4 | Search | Results list of `ProductCard`, filters (grade, safety, accuracy band, category), sort (grade, accuracy, recently tested), recent searches | Empty query, no results → request CTA |
| 5 | Scan | Full-screen camera, framing guide, torch toggle, haptic on detect; permission explainer | Permission denied, match → product page, no match → Not tested sheet |
| 6 | Not tested sheet | Scanned barcode, "We haven't tested this yet", Request testing (sign-in), see similar tested products | Already requested → show vote count |
| 7 | Product page | `ScoreHeader`, `KeyFindings`, ingredients + additives, label vs lab (partial free: top 3 rows; rest Premium), contaminants (Premium), score history (Premium), alternatives, lab and batch info, "How we score" link, share, save | Stale, unsafe banner, insufficient data |
| 8 | Compare | Up to 3 products in columns: verdicts, key nutrients, additives count | Premium only; add/remove |
| 9 | Saved | Favourites list + scan history tab | Signed out → sign-in prompt |
| 10 | Requests | Queue sorted by weighted votes; upvote; my requests | |
| 11 | Paywall | Benefits list, monthly/annual cards, trial note, restore purchases, terms | Mock purchase in Expo Go |
| 12 | Methodology | How we test, the three scores, weights, test frequency, independence policy, labs | Static content from config |
| 13 | Profile | Account, goals, notifications, privacy (export data, delete account), about; Developer section (dev builds only): data source, premium toggle | Signed out state |
| 14 | Auth | Email → 6-digit code → done | Errors, resend timer |

## 6. Copy guidelines

- Use "measured" (lab) and "declared" (label). Example: "Protein: declared 25 g, measured 21 g (16% lower)."
- Unsafe banner: "Lead measured above the FSSAI limit in the batch tested on 12 Aug 2026." — facts, batch, date. No adjectives.
- Always attribute to a batch and date; never generalise to "this brand is unsafe".
- Numbers: Indian locale formatting; ₹ for prices.

## 7. Mock data (Phases 1–2)

- 20 fictional products: 10 in **Whey protein**, 10 in **Protein bars**, from 5 fictional brands (e.g. "Demo Nutrition Co.", "Sample Foods Pvt Ltd").
- Spread of grades A–F, at least one Unsafe, one Caution, one Stale, one with insufficient label data, several with 2–4 test cycles of history.
- Scores in mock data must be produced by the real `packages/core` engine from mock label and lab values, not typed by hand.
- Barcodes: fictional EAN-13 values starting with `890` and a valid check digit. Also include a Developer "simulate scan" input so scanning can be tested without the physical product.
- Product images: neutral placeholders (initials on a coloured tile), no real packaging.
