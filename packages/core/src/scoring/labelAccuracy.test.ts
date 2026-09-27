import { describe, expect, it } from 'vitest';
import { computeLabelAccuracy } from './labelAccuracy';

describe('computeLabelAccuracy', () => {
  it('V1 — mixed deviations, some harmful', () => {
    const result = computeLabelAccuracy(
      { energy_kcal: 400, protein_g: 25, sugar_g: 5, sodium_mg: 200 },
      { energy_kcal: 410, protein_g: 21, sugar_g: 5.4, sodium_mg: 180 },
    );

    expect(result.las).toBe(79.1);
    expect(result.band).toBe('minor_gaps');

    const byCode = Object.fromEntries(result.nutrients.map((n) => [n.code, n]));
    expect(byCode.energy_kcal?.subScore).toBeCloseTo(100, 9);
    expect(byCode.protein_g?.subScore).toBeCloseTo(30, 9);
    expect(byCode.sugar_g?.subScore).toBeCloseTo(90, 9);
    expect(byCode.sodium_mg?.subScore).toBeCloseTo(100, 9);
    expect(byCode.protein_g?.harmful).toBe(true);
    expect(byCode.sodium_mg?.harmful).toBe(false);
  });

  it('V2 — perfect match on all 8 nutrients', () => {
    const values = {
      energy_kcal: 400,
      protein_g: 25,
      carbohydrate_g: 50,
      sugar_g: 5,
      total_fat_g: 10,
      sat_fat_g: 3,
      fibre_g: 6,
      sodium_mg: 200,
    };
    const result = computeLabelAccuracy(values, values);

    expect(result.las).toBe(100.0);
    expect(result.band).toBe('accurate');
    expect(result.nutrients).toHaveLength(8);
    expect(result.nutrients.every((n) => n.subScore === 100)).toBe(true);
  });

  it('V3 — fewer than 3 nutrients present is insufficient data', () => {
    const result = computeLabelAccuracy(
      { protein_g: 25, sugar_g: 5 },
      { protein_g: 21, sugar_g: 5.4 },
    );

    expect(result.las).toBeNull();
    expect(result.band).toBe('insufficient_data');
    expect(result.nutrients).toHaveLength(2);
  });

  it('V4 — label declares 0: within absolute tolerance scores 100, beyond it scores 0', () => {
    const within = computeLabelAccuracy(
      { energy_kcal: 400, protein_g: 25, sugar_g: 0 },
      { energy_kcal: 400, protein_g: 25, sugar_g: 0.3 },
    );
    const sugarWithin = within.nutrients.find((n) => n.code === 'sugar_g');
    expect(sugarWithin?.subScore).toBe(100);

    const beyond = computeLabelAccuracy(
      { energy_kcal: 400, protein_g: 25, sugar_g: 0 },
      { energy_kcal: 400, protein_g: 25, sugar_g: 1.2 },
    );
    const sugarBeyond = beyond.nutrients.find((n) => n.code === 'sugar_g');
    expect(sugarBeyond?.subScore).toBe(0);
  });

  it('rounds the LAS before deriving the band, so a raw value just under a threshold can still cross it', () => {
    // energy & protein perfect (s=100, weight 0.18 each); sugar controlled to
    // land the pre-round weighted average at exactly 89.96 (< 90 raw).
    // (0.18*100 + 0.18*100 + 0.16*s) / 0.52 = 89.96  =>  s = 67.37
    const label = { energy_kcal: 100, protein_g: 100, sugar_g: 100 };
    const lab = { energy_kcal: 100, protein_g: 100, sugar_g: 100 * (1 - 0.16526) };

    const result = computeLabelAccuracy(label, lab);

    // The stored LAS is already round1'd; 89.96 rounds up to exactly 90.0.
    expect(result.las).toBe(90.0);
    // Banding must use that rounded 90.0, not the raw 89.96, per DECISIONS.md.
    expect(result.band).toBe('accurate');
  });

  it('rejects negative, NaN or Infinity inputs', () => {
    expect(() =>
      computeLabelAccuracy(
        { energy_kcal: -1, protein_g: 25, sugar_g: 5 },
        { energy_kcal: 400, protein_g: 21, sugar_g: 5.4 },
      ),
    ).toThrow();

    expect(() =>
      computeLabelAccuracy(
        { energy_kcal: 400, protein_g: 25, sugar_g: 5 },
        { energy_kcal: Number.NaN, protein_g: 21, sugar_g: 5.4 },
      ),
    ).toThrow();

    expect(() =>
      computeLabelAccuracy(
        { energy_kcal: 400, protein_g: 25, sugar_g: 5 },
        { energy_kcal: Number.POSITIVE_INFINITY, protein_g: 21, sugar_g: 5.4 },
      ),
    ).toThrow();
  });
});
