import { describe, expect, it } from 'vitest';
import { computeSafety } from './safety';

describe('computeSafety', () => {
  it('V7 — caution when a contaminant ratio is above 0.5 but no ratio exceeds 1', () => {
    const result = computeSafety({
      contaminants: [
        { parameterCode: 'lead_mg_kg', value: 0.6, belowDetection: false, limit: 1 },
        { parameterCode: 'cadmium_mg_kg', value: 0.2, belowDetection: false, limit: 1 },
      ],
      allergens: [],
      declaredAllergens: [],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected ok');
    expect(result.status).toBe('caution');
    expect(result.worstRatio).toBeCloseTo(0.6, 9);
  });

  it('V8 — an undeclared allergen triggers caution; declaring it makes it safe', () => {
    const base = {
      contaminants: [{ parameterCode: 'lead_mg_kg', value: 0.1, belowDetection: false, limit: 1 }],
      allergens: [{ allergenCode: 'peanut', detected: true }],
    };

    const undeclared = computeSafety({ ...base, declaredAllergens: ['milk'] });
    expect(undeclared.ok && undeclared.status).toBe('caution');

    const declared = computeSafety({ ...base, declaredAllergens: ['milk', 'peanut'] });
    expect(declared.ok && declared.status).toBe('safe');
  });

  it('treats a ratio of exactly 0.5 as safe and exactly 1.0 as caution (strict >)', () => {
    const atCaution = computeSafety({
      contaminants: [{ parameterCode: 'lead_mg_kg', value: 0.5, belowDetection: false, limit: 1 }],
      allergens: [],
      declaredAllergens: [],
    });
    expect(atCaution.ok && atCaution.status).toBe('safe');

    const atUnsafe = computeSafety({
      contaminants: [{ parameterCode: 'lead_mg_kg', value: 1, belowDetection: false, limit: 1 }],
      allergens: [],
      declaredAllergens: [],
    });
    expect(atUnsafe.ok && atUnsafe.status).toBe('caution');

    const overUnsafe = computeSafety({
      contaminants: [{ parameterCode: 'lead_mg_kg', value: 1.01, belowDetection: false, limit: 1 }],
      allergens: [],
      declaredAllergens: [],
    });
    expect(overUnsafe.ok && overUnsafe.status).toBe('unsafe');
  });

  it('below_detection forces a ratio of 0 regardless of the recorded value', () => {
    const result = computeSafety({
      contaminants: [{ parameterCode: 'lead_mg_kg', value: 50, belowDetection: true, limit: 1 }],
      allergens: [],
      declaredAllergens: [],
    });
    expect(result.ok && result.status).toBe('safe');
    expect(result.ok && result.worstRatio).toBe(0);
  });

  it('requires at least one contaminant WITH a limit; limit-less contaminants are display-only', () => {
    const insufficient = computeSafety({
      contaminants: [{ parameterCode: 'microbial_x', value: 5, belowDetection: false, limit: null }],
      allergens: [],
      declaredAllergens: [],
    });
    expect(insufficient).toEqual({ ok: false, error: 'INSUFFICIENT_SAFETY_DATA' });

    const mixed = computeSafety({
      contaminants: [
        { parameterCode: 'microbial_x', value: 5, belowDetection: false, limit: null },
        { parameterCode: 'lead_mg_kg', value: 0.2, belowDetection: false, limit: 1 },
      ],
      allergens: [],
      declaredAllergens: [],
    });
    expect(mixed.ok).toBe(true);
    if (!mixed.ok) throw new Error('expected ok');
    expect(mixed.contaminants).toEqual([
      { parameterCode: 'microbial_x', value: 5, belowDetection: false, limit: null, ratio: null },
      { parameterCode: 'lead_mg_kg', value: 0.2, belowDetection: false, limit: 1, ratio: 0.2 },
    ]);
  });

  it('rejects negative, NaN or Infinity values and limits', () => {
    expect(() =>
      computeSafety({
        contaminants: [{ parameterCode: 'lead_mg_kg', value: -1, belowDetection: false, limit: 1 }],
        allergens: [],
        declaredAllergens: [],
      }),
    ).toThrow();

    expect(() =>
      computeSafety({
        contaminants: [
          { parameterCode: 'lead_mg_kg', value: Number.NaN, belowDetection: false, limit: 1 },
        ],
        allergens: [],
        declaredAllergens: [],
      }),
    ).toThrow();

    expect(() =>
      computeSafety({
        contaminants: [
          {
            parameterCode: 'lead_mg_kg',
            value: 1,
            belowDetection: false,
            limit: Number.POSITIVE_INFINITY,
          },
        ],
        allergens: [],
        declaredAllergens: [],
      }),
    ).toThrow();
  });
});
