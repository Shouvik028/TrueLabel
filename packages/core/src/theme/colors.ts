import type { AccuracyBand, Grade, SafetyStatus } from '../types/enums';

export type ThemeMode = 'light' | 'dark';

export interface BaseColorSet {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentOn: string;
  premium: string;
}

/** DESIGN.md §2 "Colour (light / dark)" table. */
export const BASE_PALETTE: Record<ThemeMode, BaseColorSet> = {
  light: {
    bg: '#FFFFFF',
    surface: '#F5F6F7',
    surfaceRaised: '#FFFFFF',
    border: '#E3E5E8',
    text: '#111418',
    textMuted: '#5B6470',
    accent: '#0F766E',
    accentOn: '#FFFFFF',
    premium: '#7C3AED',
  },
  dark: {
    bg: '#0F1113',
    surface: '#1A1D20',
    surfaceRaised: '#23272B',
    border: '#2E3338',
    text: '#F2F4F5',
    textMuted: '#A3ACB6',
    accent: '#2DD4BF',
    accentOn: '#04211F',
    premium: '#A78BFA',
  },
};

export interface GradeColorSet {
  fill: string;
  textOnFill: string;
}

/**
 * DESIGN.md §2 "Grade scale" table. The fill is a self-contained badge
 * background (the badge always carries its own colour), so it does not need
 * a separate dark-mode shade — light and dark are identical by design. Kept
 * as a light/dark record for a uniform shape with the rest of the palette.
 */
export const GRADE_COLORS: Record<Grade, Record<ThemeMode, GradeColorSet>> = {
  A: {
    light: { fill: '#1B7F3B', textOnFill: '#FFFFFF' },
    dark: { fill: '#1B7F3B', textOnFill: '#FFFFFF' },
  },
  B: {
    light: { fill: '#4D7C0F', textOnFill: '#FFFFFF' },
    dark: { fill: '#4D7C0F', textOnFill: '#FFFFFF' },
  },
  C: {
    light: { fill: '#CA8A04', textOnFill: '#111418' },
    dark: { fill: '#CA8A04', textOnFill: '#111418' },
  },
  D: {
    light: { fill: '#EA7A1A', textOnFill: '#111418' },
    dark: { fill: '#EA7A1A', textOnFill: '#111418' },
  },
  E: {
    light: { fill: '#C2410C', textOnFill: '#FFFFFF' },
    dark: { fill: '#C2410C', textOnFill: '#FFFFFF' },
  },
  F: {
    light: { fill: '#B42318', textOnFill: '#FFFFFF' },
    dark: { fill: '#B42318', textOnFill: '#FFFFFF' },
  },
};

type ScoredSafetyStatus = Exclude<SafetyStatus, never>;

/**
 * DESIGN.md §2 "Safety" table. The light shades are rendered as icon/text
 * colour directly on `bg`/`surface`, which only clears 4.5:1 against the
 * light palette. The dark values below are new — lightened tints of the same
 * hue — added so the same rule holds against the dark `bg`/`surface`. See
 * DECISIONS.md and DESIGN.md for the before/after values.
 */
export const SAFETY_COLORS: Record<ScoredSafetyStatus, Record<ThemeMode, string>> = {
  safe: { light: '#1B7F3B', dark: '#34D399' },
  caution: { light: '#B45309', dark: '#FBBF24' },
  unsafe: { light: '#B42318', dark: '#F87171' },
};

type ScoredAccuracyBand = Exclude<AccuracyBand, 'insufficient_data'>;

/**
 * DESIGN.md §2 "Label accuracy bands". Same dark-mode contrast issue and fix
 * as SAFETY_COLORS above. `insufficient_data` has no colour of its own — it
 * is displayed with the theme's `textMuted`.
 */
export const ACCURACY_BAND_COLORS: Record<ScoredAccuracyBand, Record<ThemeMode, string>> = {
  accurate: { light: '#1B7F3B', dark: '#34D399' },
  minor_gaps: { light: '#4D7C0F', dark: '#A3E635' },
  misleading: { light: '#B45309', dark: '#FBBF24' },
  inaccurate: { light: '#B42318', dark: '#F87171' },
};
