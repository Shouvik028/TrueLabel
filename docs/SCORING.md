# TrueLabel — Scoring Specification

Methodology version: **`v1.0-draft`**. All weights, thresholds and benchmarks below are starting values to be signed off by a food scientist / nutritionist before launch. Keep every constant in one config object in `packages/core/src/scoring/config.ts` so it can be changed without touching logic. Every stored score records the `methodology_version` used.

Implement this in `packages/core` as pure functions. No I/O, no dates from `Date.now()` inside scoring (pass `asOf` in).

```ts
computeSafety(input): SafetyResult
computeLabelAccuracy(label, lab): LabelAccuracyResult
computeFoodGrade(input): FoodGradeResult
computeProductScore(input): ProductScore   // runs all three, returns breakdown for storage
```

All values are **per 100 g** (or per 100 ml for liquids). Energy in kcal, sodium in mg, other nutrients in g, contaminants in the unit of their `test_parameters` row (usually mg/kg).

## 1. Parameter codes

| Code | Name | Kind |
| --- | --- | --- |
| `energy_kcal` | Energy | nutrient |
| `protein_g` | Protein | nutrient |
| `carbohydrate_g` | Total carbohydrate | nutrient |
| `sugar_g` | Total sugars | nutrient |
| `total_fat_g` | Total fat | nutrient |
| `sat_fat_g` | Saturated fat | nutrient |
| `fibre_g` | Dietary fibre | nutrient |
| `sodium_mg` | Sodium | nutrient |
| `lead_mg_kg`, `cadmium_mg_kg`, `arsenic_mg_kg`, `mercury_mg_kg`, `aflatoxin_ug_kg`, … | Contaminants | contaminant |
| `allergen_<name>` (e.g. `allergen_peanut`) | Allergen detected (1 = detected, 0 = not) | allergen |

Contaminant limits come from `test_parameters.fssai_limit` (with optional category overrides). The standard test panel is TBD (depends on lab partner); the engine must work with whatever parameters are present.

## 2. Safety status

```
for each contaminant result with a limit:
    r = below_detection ? 0 : value / limit
unsafe  if any r > 1
caution if any r > 0.5
        or any allergen result = 1 whose allergen is NOT in the label's declared allergens
safe    otherwise
```

- Publishing requires at least one contaminant result **with a limit**; contaminants without a limit are returned for display but are not scored. Otherwise return error `INSUFFICIENT_SAFETY_DATA`.
- Return the worst ratio and the list of parameters that triggered caution/unsafe (for display).

## 3. Label Accuracy Score (LAS, 0–100)

### 3.1 Constants

| Nutrient | Weight `w` | Harmful direction | Absolute tolerance when label = 0 |
| --- | --- | --- | --- |
| `energy_kcal` | 0.18 | lab > label | 5 kcal |
| `protein_g` | 0.18 | lab < label | 0.5 g |
| `sugar_g` | 0.16 | lab > label | 0.5 g |
| `sodium_mg` | 0.16 | lab > label | 5 mg |
| `total_fat_g` | 0.10 | lab > label | 0.5 g |
| `sat_fat_g` | 0.08 | lab > label | 0.5 g |
| `carbohydrate_g` | 0.08 | lab > label | 0.5 g |
| `fibre_g` | 0.06 | lab < label | 0.5 g |

Tolerance `t = 0.10` (±10%) by default, overridable per nutrient in config. Harmful-direction multiplier `k = 1.5`.

### 3.2 Algorithm

```
for each nutrient i present in BOTH label and lab:
    if label_i == 0:
        d_i = (lab_i <= absTol_i) ? 0 : +infinity
    else:
        d_i = |lab_i - label_i| / label_i
        if deviation is in the harmful direction: d_i = d_i * k
    s_i = clamp(100 * (3t - d_i) / (2t), 0, 100)
        # 100 while d_i <= t, falls linearly to 0 at d_i = 3t

if fewer than 3 nutrients present: LAS = null, band = "insufficient_data"
else LAS = round1( Σ w_i s_i / Σ w_i )       # renormalise over present nutrients
```

`round1` = round half away from zero to 1 decimal. Display as an integer (`Math.round`).

Derive the band (§3.3) from the **rounded** LAS, not the raw pre-round value, so the stored number and the band can never disagree.

### 3.3 Bands

| LAS | Band key | Label |
| --- | --- | --- |
| ≥ 90 | `accurate` | Accurate |
| ≥ 70 | `minor_gaps` | Minor gaps |
| ≥ 50 | `misleading` | Misleading |
| < 50 | `inaccurate` | Inaccurate |

Return per-nutrient detail: label, lab, deviation %, direction (`over`/`under`), harmful (bool), sub-score.

## 4. Food Grade (A–F)

Uses **lab** values. Composite 0–100:

```
composite = 0.45 * N + 0.25 * C + 0.20 * A + 0.10 * P
if safety == unsafe: grade = 'F' (composite still stored)
```

### 4.1 Nutrition sub-score N (within category)

Each category has `benchmarks` (JSON) giving, per nutrient, a `good` and a `poor` value per 100 g. Categories without benchmarks inherit from their parent, then from `default`.

| Nutrient | Weight | Type |
| --- | --- | --- |
| `sugar_g` | 0.25 | negative (lower is better) |
| `sodium_mg` | 0.20 | negative |
| `sat_fat_g` | 0.20 | negative |
| `energy_kcal` | 0.10 | negative |
| `protein_g` | 0.15 | positive (higher is better) |
| `fibre_g` | 0.10 | positive |

```
negative: n_i = clamp(100 * (poor - value) / (poor - good), 0, 100)
positive: n_i = clamp(100 * (value - poor) / (good - poor), 0, 100)
N = Σ weight_i n_i / Σ weight_i   over nutrients with a lab value and a benchmark
if no nutrient available: error INSUFFICIENT_NUTRITION_DATA
```

Placeholder benchmarks (to be set by a nutritionist):

```json
{
  "default":       { "sugar_g": {"good": 5,  "poor": 22.5}, "sodium_mg": {"good": 120, "poor": 600},
                     "sat_fat_g": {"good": 1.5, "poor": 5}, "energy_kcal": {"good": 150, "poor": 450},
                     "protein_g": {"good": 10, "poor": 2},   "fibre_g": {"good": 6, "poor": 1} },
  "protein-bars":  { "sugar_g": {"good": 5,  "poor": 20},  "sodium_mg": {"good": 150, "poor": 500},
                     "sat_fat_g": {"good": 2,  "poor": 8},  "energy_kcal": {"good": 350, "poor": 450},
                     "protein_g": {"good": 25, "poor": 10},  "fibre_g": {"good": 8, "poor": 2} },
  "whey-protein":  { "sugar_g": {"good": 3,  "poor": 12},  "sodium_mg": {"good": 150, "poor": 450},
                     "sat_fat_g": {"good": 1.5, "poor": 5}, "energy_kcal": {"good": 380, "poor": 450},
                     "protein_g": {"good": 75, "poor": 55},  "fibre_g": {"good": 3, "poor": 0} }
}
```

### 4.2 Contaminant sub-score C

```
for each contaminant with a limit: c_j = 100 * (1 - min(r_j, 1))
C = min_j c_j            # the worst contaminant dominates
```

If no contaminant has a limit, return error `INSUFFICIENT_CONTAMINANT_DATA`. In practice this only arises when Food Grade is computed on its own — Safety's publishing rule (§2) already requires at least one contaminant with a limit.

### 4.3 Additive sub-score A

```
A = max(0, 100 - 5 * (#low) - 15 * (#moderate) - 30 * (#high))
```

Additives come from the label version linked to the batch.

### 4.4 Processing sub-score P

`label_versions.processing_level` (set by a content admin, NOVA-style 1–4):

| Level | Meaning | P |
| --- | --- | --- |
| 1 | Unprocessed / minimally processed | 100 |
| 2 | Processed culinary ingredient | 75 |
| 3 | Processed food | 50 |
| 4 | Ultra-processed | 10 |

### 4.5 Letter

| Composite | Grade | Label |
| --- | --- | --- |
| ≥ 80 | A | Excellent |
| ≥ 65 | B | Good |
| ≥ 50 | C | Fair |
| ≥ 35 | D | Poor |
| ≥ 20 | E | Very poor |
| < 20 | F | Avoid |

Unsafe safety status always yields F.

Round the composite (round1) before applying these thresholds, so the stored number and the letter can never disagree.

## 5. Freshness

```
next_test_due = purchase_date_of_latest_published_batch + test_frequency_months
is_stale      = asOf > next_test_due + 30 days
```

Stale products keep their last score but show a "Stale — retest overdue" badge.

## 6. Test vectors (must pass exactly)

Final LAS and composite values must match after `round1`; compare intermediate sub-scores with a 1e-9 tolerance (floating point).

### V1 — Label accuracy, mixed

Label: energy 400, protein 25, sugar 5, sodium 200. Lab: energy 410, protein 21, sugar 5.4, sodium 180.

| Nutrient | d | Harmful? | d used | s |
| --- | --- | --- | --- | --- |
| energy | 0.025 | yes (over) | 0.0375 | 100 |
| protein | 0.16 | yes (under) | 0.24 | 30 |
| sugar | 0.08 | yes (over) | 0.12 | 90 |
| sodium | 0.10 | no (under) | 0.10 | 100 |

LAS = (0.18·100 + 0.18·30 + 0.16·90 + 0.16·100) / 0.68 = 53.8 / 0.68 = **79.1** → band `minor_gaps`.

### V2 — Label accuracy, perfect

All 8 nutrients with lab = label → **LAS 100.0**, `accurate`.

### V3 — Label accuracy, insufficient data

Only protein and sugar present → **LAS null**, `insufficient_data`.

### V4 — Zero on label

Label sugar 0, lab sugar 0.3 → s = 100. Label sugar 0, lab sugar 1.2 → s = 0.

### V5 — Food grade composite

N = 70, contaminants lead r = 0.2 (c = 80) and cadmium r = 0.1 (c = 90) → C = 80, additives 1 moderate + 1 low → A = 80, processing level 3 → P = 50.
Composite = 0.45·70 + 0.25·80 + 0.20·80 + 0.10·50 = 31.5 + 20 + 16 + 5 = **72.5** → **B**. Safety: max r = 0.2 → **safe**.

### V6 — Unsafe overrides

Same as V5 but lead r = 1.2 → C = 0, composite = 31.5 + 0 + 16 + 5 = **52.5**, safety **unsafe**, grade **F**.

### V7 — Caution

Lead r = 0.6, everything else below 0.5 → safety **caution**.

### V8 — Undeclared allergen

`allergen_peanut = 1`, label allergens = ["milk"] → safety **caution**. Same with label allergens = ["milk", "peanut"] → **safe**.

### V9 — Nutrition sub-score (protein-bars benchmarks)

Lab: sugar 12.5, sodium 325, sat fat 5, energy 400, protein 17.5, fibre 5.
n: sugar 50, sodium 50, sat fat 50, energy 50, protein 50, fibre 50 → **N = 50.0**.

### V10 — Freshness

purchase 2026-01-10, frequency 2 → due 2026-03-10. asOf 2026-04-09 → not stale (exactly 30 days). asOf 2026-04-10 → **stale**.
