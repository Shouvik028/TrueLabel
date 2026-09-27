import { describe, expect, it } from 'vitest';
import {
  ACCURACY_BAND_COLORS,
  BASE_PALETTE,
  GRADE_COLORS,
  SAFETY_COLORS,
  type ThemeMode,
} from './colors';
import { contrastRatio } from './contrast';

const MIN_CONTRAST = 4.5;
const MODES: ThemeMode[] = ['light', 'dark'];

describe('GRADE_COLORS fill/text contrast', () => {
  for (const mode of MODES) {
    for (const grade of Object.keys(GRADE_COLORS) as (keyof typeof GRADE_COLORS)[]) {
      it(`grade ${grade} (${mode}) fill vs textOnFill >= ${MIN_CONTRAST}:1`, () => {
        const { fill, textOnFill } = GRADE_COLORS[grade][mode];
        expect(contrastRatio(fill, textOnFill)).toBeGreaterThanOrEqual(MIN_CONTRAST);
      });
    }
  }
});

describe('SAFETY_COLORS legibility on bg and surface', () => {
  for (const mode of MODES) {
    for (const status of Object.keys(SAFETY_COLORS) as (keyof typeof SAFETY_COLORS)[]) {
      it(`safety ${status} (${mode}) vs bg >= ${MIN_CONTRAST}:1`, () => {
        expect(
          contrastRatio(SAFETY_COLORS[status][mode], BASE_PALETTE[mode].bg),
        ).toBeGreaterThanOrEqual(MIN_CONTRAST);
      });
      it(`safety ${status} (${mode}) vs surface >= ${MIN_CONTRAST}:1`, () => {
        expect(
          contrastRatio(SAFETY_COLORS[status][mode], BASE_PALETTE[mode].surface),
        ).toBeGreaterThanOrEqual(MIN_CONTRAST);
      });
    }
  }
});

describe('ACCURACY_BAND_COLORS legibility on bg and surface', () => {
  for (const mode of MODES) {
    for (const band of Object.keys(ACCURACY_BAND_COLORS) as (keyof typeof ACCURACY_BAND_COLORS)[]) {
      it(`band ${band} (${mode}) vs bg >= ${MIN_CONTRAST}:1`, () => {
        expect(
          contrastRatio(ACCURACY_BAND_COLORS[band][mode], BASE_PALETTE[mode].bg),
        ).toBeGreaterThanOrEqual(MIN_CONTRAST);
      });
      it(`band ${band} (${mode}) vs surface >= ${MIN_CONTRAST}:1`, () => {
        expect(
          contrastRatio(ACCURACY_BAND_COLORS[band][mode], BASE_PALETTE[mode].surface),
        ).toBeGreaterThanOrEqual(MIN_CONTRAST);
      });
    }
  }
});

describe('BASE_PALETTE text legibility', () => {
  for (const mode of MODES) {
    const { bg, surface, surfaceRaised, text, textMuted, accent, accentOn, premium } =
      BASE_PALETTE[mode];

    it(`text (${mode}) vs bg >= ${MIN_CONTRAST}:1`, () => {
      expect(contrastRatio(text, bg)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
    it(`text (${mode}) vs surface >= ${MIN_CONTRAST}:1`, () => {
      expect(contrastRatio(text, surface)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
    it(`textMuted (${mode}) vs bg >= ${MIN_CONTRAST}:1`, () => {
      expect(contrastRatio(textMuted, bg)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
    it(`textMuted (${mode}) vs surface >= ${MIN_CONTRAST}:1`, () => {
      expect(contrastRatio(textMuted, surface)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
    it(`accentOn (${mode}) vs accent >= ${MIN_CONTRAST}:1`, () => {
      expect(contrastRatio(accentOn, accent)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
    it(`premium (${mode}) vs surface >= ${MIN_CONTRAST}:1`, () => {
      expect(contrastRatio(premium, surface)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
    it(`premium (${mode}) vs surfaceRaised >= ${MIN_CONTRAST}:1 (PremiumLock CTA)`, () => {
      expect(contrastRatio(premium, surfaceRaised)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
  }
});
