import type { CategoryBenchmarks } from '../types/product';
import type { ConcernLevel, ProcessingLevel } from '../types/enums';
import type { NutrientCode } from '../types/testResult';
import type { ProductScoreBreakdown } from '../types/score';
import { METHODOLOGY_VERSION } from './config';
import type { AllergenReading, ContaminantReading } from './safety';
import { computeSafety } from './safety';
import { computeLabelAccuracy } from './labelAccuracy';
import { computeFoodGrade } from './foodGrade';

export interface ComputeProductScoreInput {
  contaminants: ContaminantReading[];
  allergens: AllergenReading[];
  declaredAllergens: string[];
  label: Partial<Record<NutrientCode, number>>;
  lab: Partial<Record<NutrientCode, number>>;
  benchmarks: CategoryBenchmarks;
  additives: ConcernLevel[];
  processingLevel: ProcessingLevel;
}

export type ProductScoreErrorCode =
  | 'INSUFFICIENT_SAFETY_DATA'
  | 'INSUFFICIENT_NUTRITION_DATA'
  | 'INSUFFICIENT_CONTAMINANT_DATA';

export type ProductScoreResult =
  | { ok: true; score: ProductScoreBreakdown }
  | { ok: false; errors: ProductScoreErrorCode[] };

/**
 * Runs safety, label accuracy and food grade together and returns the
 * breakdown that would be stored on a `scores` row. Grade depends on safety
 * status, so an insufficient-safety-data result short-circuits before food
 * grade is attempted; label accuracy is independent and always computed.
 */
export function computeProductScore(input: ComputeProductScoreInput): ProductScoreResult {
  const safety = computeSafety({
    contaminants: input.contaminants,
    allergens: input.allergens,
    declaredAllergens: input.declaredAllergens,
  });

  const labelAccuracy = computeLabelAccuracy(input.label, input.lab);

  if (!safety.ok) {
    return { ok: false, errors: [safety.error] };
  }

  const foodGrade = computeFoodGrade({
    safetyStatus: safety.status,
    nutrition: input.lab,
    benchmarks: input.benchmarks,
    contaminants: input.contaminants,
    additives: input.additives,
    processingLevel: input.processingLevel,
  });

  if (!foodGrade.ok) {
    return { ok: false, errors: [foodGrade.error] };
  }

  return {
    ok: true,
    score: { methodologyVersion: METHODOLOGY_VERSION, safety, labelAccuracy, foodGrade },
  };
}
