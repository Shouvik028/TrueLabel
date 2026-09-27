import {
  ACCURACY_BAND_COLORS,
  BASE_PALETTE,
  GRADE_COLORS,
  SAFETY_COLORS,
  type AccuracyBand,
  type Grade,
  type SafetyStatus,
  type ThemeMode,
} from '@truelabel/core';

export type { ThemeMode };

/** DESIGN.md §2 "Type, spacing, shape" — 4-pt grid. */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

/** Minimum touch target size in points, per DESIGN.md §2. */
export const MIN_TOUCH_TARGET = 44;

export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '600' | '700';
}

export const TYPE_SCALE: Record<'display' | 'title' | 'heading' | 'body' | 'caption' | 'micro', TypeStyle> = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '700' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  heading: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '400' },
};

/** "Not enough data" bands have no colour of their own — they use textMuted. */
function isScoredBand(band: AccuracyBand): band is Exclude<AccuracyBand, 'insufficient_data'> {
  return band !== 'insufficient_data';
}

export interface Theme {
  mode: ThemeMode;
  colors: (typeof BASE_PALETTE)['light'];
  spacing: typeof SPACING;
  radius: typeof RADIUS;
  minTouchTarget: number;
  type: typeof TYPE_SCALE;
  gradeColor: (grade: Grade) => { fill: string; textOnFill: string };
  safetyColor: (status: SafetyStatus) => string;
  accuracyBandColor: (band: AccuracyBand) => string;
}

export function buildTheme(mode: ThemeMode): Theme {
  return {
    mode,
    colors: BASE_PALETTE[mode],
    spacing: SPACING,
    radius: RADIUS,
    minTouchTarget: MIN_TOUCH_TARGET,
    type: TYPE_SCALE,
    gradeColor: (grade) => GRADE_COLORS[grade][mode],
    safetyColor: (status) => SAFETY_COLORS[status][mode],
    accuracyBandColor: (band) =>
      isScoredBand(band) ? ACCURACY_BAND_COLORS[band][mode] : BASE_PALETTE[mode].textMuted,
  };
}
