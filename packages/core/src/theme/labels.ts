import type { AccuracyBand, Grade, SafetyStatus } from '../types/enums';

/** DESIGN.md §2 "Grade scale" / SCORING.md §4.5 — display word for each letter grade. */
export const GRADE_WORDS: Record<Grade, string> = {
  A: 'Excellent',
  B: 'Good',
  C: 'Fair',
  D: 'Poor',
  E: 'Very poor',
  F: 'Avoid',
};

/** DESIGN.md §2 "Safety" — display word for each safety status. */
export const SAFETY_WORDS: Record<SafetyStatus, string> = {
  safe: 'Safe',
  caution: 'Caution',
  unsafe: 'Unsafe',
};

export const NOT_ASSESSED_WORD = 'Not assessed';

/** DESIGN.md §2 "Label accuracy bands" — display word for each band. */
export const ACCURACY_BAND_WORDS: Record<AccuracyBand, string> = {
  accurate: 'Accurate',
  minor_gaps: 'Minor gaps',
  misleading: 'Misleading',
  inaccurate: 'Inaccurate',
  insufficient_data: 'Not enough data',
};
