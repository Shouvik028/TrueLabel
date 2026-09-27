import { describe, expect, it } from 'vitest';
import { computeProductScore } from './productScore';
import { METHODOLOGY_VERSION } from './config';

const singleNutrientBenchmarks = { protein_g: { good: 100, poor: 0 } };

describe('computeProductScore', () => {
  it('composes safety, label accuracy and food grade, stamped with the methodology version', () => {
    const result = computeProductScore({
      contaminants: [
        { parameterCode: 'lead_mg_kg', value: 0.2, belowDetection: false, limit: 1 },
        { parameterCode: 'cadmium_mg_kg', value: 0.1, belowDetection: false, limit: 1 },
      ],
      allergens: [],
      declaredAllergens: [],
      label: { energy_kcal: 400, protein_g: 25, sugar_g: 5, sodium_mg: 200 },
      lab: { energy_kcal: 410, protein_g: 21, sugar_g: 5.4, sodium_mg: 180 },
      benchmarks: singleNutrientBenchmarks,
      additives: [],
      processingLevel: 1,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok');
    expect(result.score.methodologyVersion).toBe(METHODOLOGY_VERSION);
    expect(result.score.safety.ok && result.score.safety.status).toBe('safe');
    expect(result.score.labelAccuracy.las).toBe(79.1);
    expect(result.score.foodGrade.ok).toBe(true);
  });

  it('short-circuits on insufficient safety data without attempting food grade', () => {
    const result = computeProductScore({
      contaminants: [],
      allergens: [],
      declaredAllergens: [],
      label: { energy_kcal: 400, protein_g: 25, sugar_g: 5 },
      lab: { energy_kcal: 410, protein_g: 21, sugar_g: 5.4 },
      benchmarks: {}, // would also fail food grade if it were attempted
      additives: [],
      processingLevel: 1,
    });

    expect(result).toEqual({ ok: false, errors: ['INSUFFICIENT_SAFETY_DATA'] });
  });

  it('surfaces an insufficient nutrition data error once safety succeeds', () => {
    const result = computeProductScore({
      contaminants: [{ parameterCode: 'lead_mg_kg', value: 0.1, belowDetection: false, limit: 1 }],
      allergens: [],
      declaredAllergens: [],
      label: { energy_kcal: 400, protein_g: 25, sugar_g: 5 },
      lab: { energy_kcal: 410, protein_g: 21, sugar_g: 5.4 },
      benchmarks: {},
      additives: [],
      processingLevel: 1,
    });

    expect(result).toEqual({ ok: false, errors: ['INSUFFICIENT_NUTRITION_DATA'] });
  });
});
