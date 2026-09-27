export const GRADES = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export type Grade = (typeof GRADES)[number];

export const ACCURACY_BANDS = [
  'accurate',
  'minor_gaps',
  'misleading',
  'inaccurate',
  'insufficient_data',
] as const;
export type AccuracyBand = (typeof ACCURACY_BANDS)[number];

export const SAFETY_STATUSES = ['safe', 'caution', 'unsafe'] as const;
export type SafetyStatus = (typeof SAFETY_STATUSES)[number];

export const CONCERN_LEVELS = ['low', 'moderate', 'high'] as const;
export type ConcernLevel = (typeof CONCERN_LEVELS)[number];

export const PROCESSING_LEVELS = [1, 2, 3, 4] as const;
export type ProcessingLevel = (typeof PROCESSING_LEVELS)[number];

export const PARAM_KINDS = ['nutrient', 'contaminant', 'allergen', 'microbial'] as const;
export type ParamKind = (typeof PARAM_KINDS)[number];

export const VEG_MARKS = ['veg', 'non_veg', 'none'] as const;
export type VegMark = (typeof VEG_MARKS)[number];
