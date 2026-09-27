import type { CategoryBenchmarks } from '../types/product';
import type { NutrientCode, NutritionSubscoreCode } from '../types/testResult';
import type { ProcessingLevel } from '../types/enums';

/** Every stored score records the methodology version used to compute it (SCORING.md, top). */
export const METHODOLOGY_VERSION = 'v1.0-draft';

// ---------------------------------------------------------------------------
// Safety (SCORING.md §2)
// ---------------------------------------------------------------------------

export const SAFETY_UNSAFE_RATIO = 1;
export const SAFETY_CAUTION_RATIO = 0.5;

// ---------------------------------------------------------------------------
// Label Accuracy Score (SCORING.md §3)
// ---------------------------------------------------------------------------

/** Default relative tolerance `t` (±10%), overridable per nutrient below. */
export const LABEL_ACCURACY_DEFAULT_TOLERANCE = 0.1;

export interface LabelAccuracyNutrientConfig {
  weight: number;
  /** 'over' = lab > label is harmful; 'under' = lab < label is harmful. */
  harmfulDirection: 'over' | 'under';
  /** Absolute tolerance used when the label declares 0 for this nutrient. */
  absoluteToleranceWhenLabelZero: number;
  /** Relative tolerance `t` for this nutrient; defaults to LABEL_ACCURACY_DEFAULT_TOLERANCE. */
  tolerance: number;
}

export const LABEL_ACCURACY_NUTRIENTS: Record<NutrientCode, LabelAccuracyNutrientConfig> = {
  energy_kcal: {
    weight: 0.18,
    harmfulDirection: 'over',
    absoluteToleranceWhenLabelZero: 5,
    tolerance: LABEL_ACCURACY_DEFAULT_TOLERANCE,
  },
  protein_g: {
    weight: 0.18,
    harmfulDirection: 'under',
    absoluteToleranceWhenLabelZero: 0.5,
    tolerance: LABEL_ACCURACY_DEFAULT_TOLERANCE,
  },
  sugar_g: {
    weight: 0.16,
    harmfulDirection: 'over',
    absoluteToleranceWhenLabelZero: 0.5,
    tolerance: LABEL_ACCURACY_DEFAULT_TOLERANCE,
  },
  sodium_mg: {
    weight: 0.16,
    harmfulDirection: 'over',
    absoluteToleranceWhenLabelZero: 5,
    tolerance: LABEL_ACCURACY_DEFAULT_TOLERANCE,
  },
  total_fat_g: {
    weight: 0.1,
    harmfulDirection: 'over',
    absoluteToleranceWhenLabelZero: 0.5,
    tolerance: LABEL_ACCURACY_DEFAULT_TOLERANCE,
  },
  sat_fat_g: {
    weight: 0.08,
    harmfulDirection: 'over',
    absoluteToleranceWhenLabelZero: 0.5,
    tolerance: LABEL_ACCURACY_DEFAULT_TOLERANCE,
  },
  carbohydrate_g: {
    weight: 0.08,
    harmfulDirection: 'over',
    absoluteToleranceWhenLabelZero: 0.5,
    tolerance: LABEL_ACCURACY_DEFAULT_TOLERANCE,
  },
  fibre_g: {
    weight: 0.06,
    harmfulDirection: 'under',
    absoluteToleranceWhenLabelZero: 0.5,
    tolerance: LABEL_ACCURACY_DEFAULT_TOLERANCE,
  },
};

/** Harmful-direction deviation multiplier `k`. */
export const LABEL_ACCURACY_HARMFUL_MULTIPLIER = 1.5;

/** Minimum number of present nutrients required to compute a LAS. */
export const LABEL_ACCURACY_MIN_NUTRIENTS = 3;

export interface AccuracyBandThreshold {
  min: number;
  band: 'accurate' | 'minor_gaps' | 'misleading' | 'inaccurate';
}

/** Ordered highest-first; the first threshold whose `min` the rounded LAS meets wins. */
export const ACCURACY_BAND_THRESHOLDS: AccuracyBandThreshold[] = [
  { min: 90, band: 'accurate' },
  { min: 70, band: 'minor_gaps' },
  { min: 50, band: 'misleading' },
  { min: 0, band: 'inaccurate' },
];

// ---------------------------------------------------------------------------
// Food Grade (SCORING.md §4)
// ---------------------------------------------------------------------------

export const FOOD_GRADE_COMPOSITE_WEIGHTS = {
  nutrition: 0.45,
  contaminant: 0.25,
  additive: 0.2,
  processing: 0.1,
};

export interface NutritionSubscoreNutrientConfig {
  weight: number;
  /** 'negative' = lower is better; 'positive' = higher is better. */
  type: 'negative' | 'positive';
}

export const NUTRITION_SUBSCORE_NUTRIENTS: Record<
  NutritionSubscoreCode,
  NutritionSubscoreNutrientConfig
> = {
  sugar_g: { weight: 0.25, type: 'negative' },
  sodium_mg: { weight: 0.2, type: 'negative' },
  sat_fat_g: { weight: 0.2, type: 'negative' },
  energy_kcal: { weight: 0.1, type: 'negative' },
  protein_g: { weight: 0.15, type: 'positive' },
  fibre_g: { weight: 0.1, type: 'positive' },
};

/** Placeholder benchmarks (SCORING.md §4.1) — to be set by a nutritionist before launch. */
export const DEFAULT_CATEGORY_BENCHMARKS: Record<string, CategoryBenchmarks> = {
  default: {
    sugar_g: { good: 5, poor: 22.5 },
    sodium_mg: { good: 120, poor: 600 },
    sat_fat_g: { good: 1.5, poor: 5 },
    energy_kcal: { good: 150, poor: 450 },
    protein_g: { good: 10, poor: 2 },
    fibre_g: { good: 6, poor: 1 },
  },
  'protein-bars': {
    sugar_g: { good: 5, poor: 20 },
    sodium_mg: { good: 150, poor: 500 },
    sat_fat_g: { good: 2, poor: 8 },
    energy_kcal: { good: 350, poor: 450 },
    protein_g: { good: 25, poor: 10 },
    fibre_g: { good: 8, poor: 2 },
  },
  'whey-protein': {
    sugar_g: { good: 3, poor: 12 },
    sodium_mg: { good: 150, poor: 450 },
    sat_fat_g: { good: 1.5, poor: 5 },
    energy_kcal: { good: 380, poor: 450 },
    protein_g: { good: 75, poor: 55 },
    fibre_g: { good: 3, poor: 0 },
  },
};

/** Additive concern-level penalties applied to sub-score A (SCORING.md §4.3). */
export const ADDITIVE_PENALTIES = {
  low: 5,
  moderate: 15,
  high: 30,
};

/** Processing level (NOVA-style 1–4) → sub-score P (SCORING.md §4.4). */
export const PROCESSING_LEVEL_SCORES: Record<ProcessingLevel, number> = {
  1: 100,
  2: 75,
  3: 50,
  4: 10,
};

export interface GradeThreshold {
  min: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

/** Ordered highest-first; the first threshold whose `min` the rounded composite meets wins. */
export const GRADE_THRESHOLDS: GradeThreshold[] = [
  { min: 80, grade: 'A' },
  { min: 65, grade: 'B' },
  { min: 50, grade: 'C' },
  { min: 35, grade: 'D' },
  { min: 20, grade: 'E' },
  { min: 0, grade: 'F' },
];

// ---------------------------------------------------------------------------
// Freshness (SCORING.md §5)
// ---------------------------------------------------------------------------

export const FRESHNESS_STALE_GRACE_DAYS = 30;
