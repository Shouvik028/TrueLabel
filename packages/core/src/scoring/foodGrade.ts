import type { CategoryBenchmarks } from '../types/product';
import type { ConcernLevel, Grade, ProcessingLevel, SafetyStatus } from '../types/enums';
import type { NutritionSubscoreCode } from '../types/testResult';
import { NUTRITION_SUBSCORE_CODES } from '../types/testResult';
import type { ContaminantReading } from './safety';
import {
  ADDITIVE_PENALTIES,
  FOOD_GRADE_COMPOSITE_WEIGHTS,
  GRADE_THRESHOLDS,
  NUTRITION_SUBSCORE_NUTRIENTS,
  PROCESSING_LEVEL_SCORES,
} from './config';
import { assertValidMeasurement, clamp, round1 } from './util';

export interface ComputeFoodGradeInput {
  safetyStatus: SafetyStatus;
  /** Lab values for the 6 nutrition sub-score nutrients, whichever are present. */
  nutrition: Partial<Record<NutritionSubscoreCode, number>>;
  benchmarks: CategoryBenchmarks;
  contaminants: ContaminantReading[];
  additives: ConcernLevel[];
  processingLevel: ProcessingLevel;
}

export interface FoodGradeSubScores {
  nutrition: number;
  contaminant: number;
  additive: number;
  processing: number;
}

export type FoodGradeResult =
  | { ok: true; grade: Grade; composite: number; subScores: FoodGradeSubScores }
  | { ok: false; error: 'INSUFFICIENT_NUTRITION_DATA' | 'INSUFFICIENT_CONTAMINANT_DATA' };

function gradeFromRoundedComposite(composite: number): Grade {
  const match = GRADE_THRESHOLDS.find((t) => composite >= t.min);
  // GRADE_THRESHOLDS bottoms out at min: 0, so this is always defined.
  return match!.grade;
}

function computeNutritionSubScore(
  nutrition: Partial<Record<NutritionSubscoreCode, number>>,
  benchmarks: CategoryBenchmarks,
): number | 'INSUFFICIENT_NUTRITION_DATA' {
  let weightedSum = 0;
  let weightTotal = 0;

  for (const code of NUTRITION_SUBSCORE_CODES) {
    const value = nutrition[code];
    const benchmark = benchmarks[code];
    if (value === undefined || benchmark === undefined) continue;
    assertValidMeasurement(value, `nutrition ${code}`);

    const cfg = NUTRITION_SUBSCORE_NUTRIENTS[code];
    const { good, poor } = benchmark;
    const n =
      cfg.type === 'negative'
        ? clamp((100 * (poor - value)) / (poor - good), 0, 100)
        : clamp((100 * (value - poor)) / (good - poor), 0, 100);

    weightedSum += cfg.weight * n;
    weightTotal += cfg.weight;
  }

  if (weightTotal === 0) return 'INSUFFICIENT_NUTRITION_DATA';
  return weightedSum / weightTotal;
}

function computeContaminantSubScore(
  contaminants: ContaminantReading[],
): number | 'INSUFFICIENT_CONTAMINANT_DATA' {
  const ratios: number[] = [];
  for (const c of contaminants) {
    assertValidMeasurement(c.value, `contaminant ${c.parameterCode} value`);
    if (c.limit === null) continue;
    assertValidMeasurement(c.limit, `contaminant ${c.parameterCode} limit`);
    if (c.limit === 0) {
      throw new Error(`contaminant ${c.parameterCode} limit must not be zero`);
    }
    ratios.push(c.belowDetection ? 0 : c.value / c.limit);
  }

  if (ratios.length === 0) return 'INSUFFICIENT_CONTAMINANT_DATA';
  const worst = Math.max(...ratios);
  return 100 * (1 - Math.min(worst, 1));
}

function computeAdditiveSubScore(additives: ConcernLevel[]): number {
  const penalty = additives.reduce((sum, level) => sum + ADDITIVE_PENALTIES[level], 0);
  return Math.max(0, 100 - penalty);
}

/** SCORING.md §4. Uses lab values; an `unsafe` safety status always yields grade F. */
export function computeFoodGrade(input: ComputeFoodGradeInput): FoodGradeResult {
  const nutritionScore = computeNutritionSubScore(input.nutrition, input.benchmarks);
  if (nutritionScore === 'INSUFFICIENT_NUTRITION_DATA') {
    return { ok: false, error: 'INSUFFICIENT_NUTRITION_DATA' };
  }

  const contaminantScore = computeContaminantSubScore(input.contaminants);
  if (contaminantScore === 'INSUFFICIENT_CONTAMINANT_DATA') {
    return { ok: false, error: 'INSUFFICIENT_CONTAMINANT_DATA' };
  }

  const additiveScore = computeAdditiveSubScore(input.additives);
  const processingScore = PROCESSING_LEVEL_SCORES[input.processingLevel];

  const compositeRaw =
    FOOD_GRADE_COMPOSITE_WEIGHTS.nutrition * nutritionScore +
    FOOD_GRADE_COMPOSITE_WEIGHTS.contaminant * contaminantScore +
    FOOD_GRADE_COMPOSITE_WEIGHTS.additive * additiveScore +
    FOOD_GRADE_COMPOSITE_WEIGHTS.processing * processingScore;

  const composite = round1(compositeRaw);
  const grade: Grade = input.safetyStatus === 'unsafe' ? 'F' : gradeFromRoundedComposite(composite);

  return {
    ok: true,
    grade,
    composite,
    subScores: {
      nutrition: nutritionScore,
      contaminant: contaminantScore,
      additive: additiveScore,
      processing: processingScore,
    },
  };
}
