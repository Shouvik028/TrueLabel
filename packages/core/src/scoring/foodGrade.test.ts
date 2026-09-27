import { describe, expect, it } from 'vitest';
import { computeFoodGrade } from './foodGrade';
import { DEFAULT_CATEGORY_BENCHMARKS } from './config';

/** N=70 via a single present nutrient with a good=100/poor=0 benchmark, so N equals the value directly. */
const singleNutrientBenchmarks = { protein_g: { good: 100, poor: 0 } };

describe('computeFoodGrade', () => {
  it('V5 — composite and grade with safe status', () => {
    const result = computeFoodGrade({
      safetyStatus: 'safe',
      nutrition: { protein_g: 70 },
      benchmarks: singleNutrientBenchmarks,
      contaminants: [
        { parameterCode: 'lead_mg_kg', value: 0.2, belowDetection: false, limit: 1 },
        { parameterCode: 'cadmium_mg_kg', value: 0.1, belowDetection: false, limit: 1 },
      ],
      additives: ['moderate', 'low'],
      processingLevel: 3,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok');
    expect(result.subScores.nutrition).toBeCloseTo(70, 9);
    expect(result.subScores.contaminant).toBeCloseTo(80, 9);
    expect(result.subScores.additive).toBeCloseTo(80, 9);
    expect(result.subScores.processing).toBe(50);
    expect(result.composite).toBe(72.5);
    expect(result.grade).toBe('B');
  });

  it('V6 — unsafe contaminant lowers the composite and forces grade F', () => {
    const result = computeFoodGrade({
      safetyStatus: 'unsafe',
      nutrition: { protein_g: 70 },
      benchmarks: singleNutrientBenchmarks,
      contaminants: [
        { parameterCode: 'lead_mg_kg', value: 1.2, belowDetection: false, limit: 1 },
        { parameterCode: 'cadmium_mg_kg', value: 0.1, belowDetection: false, limit: 1 },
      ],
      additives: ['moderate', 'low'],
      processingLevel: 3,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok');
    expect(result.subScores.contaminant).toBe(0);
    expect(result.composite).toBe(52.5);
    expect(result.grade).toBe('F');
  });

  it('V9 — nutrition sub-score with protein-bars benchmarks', () => {
    const result = computeFoodGrade({
      safetyStatus: 'safe',
      nutrition: { sugar_g: 12.5, sodium_mg: 325, sat_fat_g: 5, energy_kcal: 400, protein_g: 17.5, fibre_g: 5 },
      benchmarks: DEFAULT_CATEGORY_BENCHMARKS['protein-bars'] ?? {},
      contaminants: [{ parameterCode: 'lead_mg_kg', value: 0, belowDetection: true, limit: 1 }],
      additives: [],
      processingLevel: 1,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok');
    expect(result.subScores.nutrition).toBe(50.0);
  });

  it('rounds the composite before deriving the grade, so a raw value just under a threshold can still cross it', () => {
    // C=100, A=100, P=100 (55 total); N chosen so 0.45*N + 55 = 79.96 exactly (raw < 80).
    const nutritionValue = (79.96 - 55) / 0.45;

    const result = computeFoodGrade({
      safetyStatus: 'safe',
      nutrition: { protein_g: nutritionValue },
      benchmarks: singleNutrientBenchmarks,
      contaminants: [{ parameterCode: 'lead_mg_kg', value: 0, belowDetection: false, limit: 1 }],
      additives: [],
      processingLevel: 1,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok');
    expect(result.composite).toBe(80.0);
    expect(result.grade).toBe('A');
  });

  it('returns INSUFFICIENT_NUTRITION_DATA when no nutrient has both a value and a benchmark', () => {
    const result = computeFoodGrade({
      safetyStatus: 'safe',
      nutrition: { protein_g: 70 },
      benchmarks: {},
      contaminants: [{ parameterCode: 'lead_mg_kg', value: 0.1, belowDetection: false, limit: 1 }],
      additives: [],
      processingLevel: 1,
    });

    expect(result).toEqual({ ok: false, error: 'INSUFFICIENT_NUTRITION_DATA' });
  });

  it('returns INSUFFICIENT_CONTAMINANT_DATA when no contaminant has a limit', () => {
    const result = computeFoodGrade({
      safetyStatus: 'safe',
      nutrition: { protein_g: 70 },
      benchmarks: singleNutrientBenchmarks,
      contaminants: [{ parameterCode: 'microbial_x', value: 5, belowDetection: false, limit: null }],
      additives: [],
      processingLevel: 1,
    });

    expect(result).toEqual({ ok: false, error: 'INSUFFICIENT_CONTAMINANT_DATA' });
  });

  it('rejects negative, NaN or Infinity nutrition and contaminant values', () => {
    expect(() =>
      computeFoodGrade({
        safetyStatus: 'safe',
        nutrition: { protein_g: -1 },
        benchmarks: singleNutrientBenchmarks,
        contaminants: [{ parameterCode: 'lead_mg_kg', value: 0.1, belowDetection: false, limit: 1 }],
        additives: [],
        processingLevel: 1,
      }),
    ).toThrow();

    expect(() =>
      computeFoodGrade({
        safetyStatus: 'safe',
        nutrition: { protein_g: 70 },
        benchmarks: singleNutrientBenchmarks,
        contaminants: [
          { parameterCode: 'lead_mg_kg', value: Number.NaN, belowDetection: false, limit: 1 },
        ],
        additives: [],
        processingLevel: 1,
      }),
    ).toThrow();
  });
});
