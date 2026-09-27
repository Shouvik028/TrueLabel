import type { ParamKind } from './enums';

/**
 * The 8 nutrient codes with defined Label Accuracy weights (SCORING.md §3.1).
 * Contaminant/allergen codes are open-ended (SCORING.md §1), so they stay `string`.
 */
export const NUTRIENT_CODES = [
  'energy_kcal',
  'protein_g',
  'carbohydrate_g',
  'sugar_g',
  'total_fat_g',
  'sat_fat_g',
  'fibre_g',
  'sodium_mg',
] as const;
export type NutrientCode = (typeof NUTRIENT_CODES)[number];

/** The 6 nutrient codes used by the Food Grade nutrition sub-score N (SCORING.md §4.1). */
export const NUTRITION_SUBSCORE_CODES = [
  'sugar_g',
  'sodium_mg',
  'sat_fat_g',
  'energy_kcal',
  'protein_g',
  'fibre_g',
] as const;
export type NutritionSubscoreCode = (typeof NUTRITION_SUBSCORE_CODES)[number];

/** Any test_parameters.code — nutrient, contaminant, allergen or microbial. */
export type ParameterCode = string;

export interface TestParameter {
  code: ParameterCode;
  name: string;
  kind: ParamKind;
  unit: string;
  fssaiLimit: number | null;
  limitSource: string | null;
  categoryOverrides: Record<string, number> | null;
}

export interface TestResult {
  batchId: string;
  parameterCode: ParameterCode;
  value: number;
  unit: string;
  method: string | null;
  belowDetection: boolean;
}
