import { describe, expect, it } from 'vitest';
import { labelDataSchema } from './labelData';

const validLabel = {
  servingSizeG: 30,
  nutrients: { energy_kcal: 400, protein_g: 25, sugar_g: 5 },
  ingredientsText: 'Whey protein concentrate, cocoa',
  allergens: ['milk'],
  claims: ['high protein'],
  fssaiLicenseNo: '12345678901234',
  vegMark: 'veg',
  processingLevel: 3,
  capturedAt: '2026-08-12T00:00:00.000Z',
  photoPaths: [],
};

describe('labelDataSchema', () => {
  it('accepts a valid label', () => {
    expect(labelDataSchema.parse(validLabel)).toEqual(validLabel);
  });

  it('accepts nutrients being partially present', () => {
    expect(() => labelDataSchema.parse({ ...validLabel, nutrients: {} })).not.toThrow();
  });

  it('rejects a negative nutrient value', () => {
    expect(() =>
      labelDataSchema.parse({ ...validLabel, nutrients: { energy_kcal: -1 } }),
    ).toThrow();
  });

  it('rejects a processing level outside 1-4', () => {
    expect(() => labelDataSchema.parse({ ...validLabel, processingLevel: 5 })).toThrow();
    expect(() => labelDataSchema.parse({ ...validLabel, processingLevel: 0 })).toThrow();
  });

  it('rejects an unknown vegMark', () => {
    expect(() => labelDataSchema.parse({ ...validLabel, vegMark: 'vegan' })).toThrow();
  });
});
