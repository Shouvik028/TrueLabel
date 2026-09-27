import { readFileSync } from 'node:fs';

import { GRADES, ACCURACY_BANDS, type Grade, type AccuracyBand } from '@truelabel/core';
import { describe, expect, it } from 'vitest';

import { buildFixture } from './lib/buildFixture';
import { FIXTURE_PATH } from './generate-mock-data';
import { LABEL_VERSIONS } from './mock-data/source/labelVersions';
import { TEST_BATCHES } from './mock-data/source/testBatches';

describe('fixture drift', () => {
  it('matches the committed fixture.json — regenerate with npm run generate:mock-data if this fails', () => {
    const rebuilt = buildFixture();
    const committed = JSON.parse(readFileSync(FIXTURE_PATH, 'utf-8'));
    expect(rebuilt).toEqual(committed);
  });
});

describe('fixture spread (DESIGN.md §7)', () => {
  const fixture = buildFixture();
  const { products } = fixture;

  it('has exactly 20 products: 10 whey-protein and 10 protein-bars', () => {
    expect(products).toHaveLength(20);
    expect(products.filter((p) => p.categorySlug === 'whey-protein')).toHaveLength(10);
    expect(products.filter((p) => p.categorySlug === 'protein-bars')).toHaveLength(10);
  });

  it('has at least one product in every Food Grade A–F', () => {
    const present = new Set(products.map((p) => p.grade));
    for (const grade of GRADES as readonly Grade[]) {
      expect(present.has(grade), `missing grade ${grade}`).toBe(true);
    }
  });

  it('has at least one product in every Label Accuracy band', () => {
    const present = new Set(products.map((p) => p.accuracyBand));
    for (const band of ACCURACY_BANDS as readonly AccuracyBand[]) {
      expect(present.has(band), `missing accuracy band ${band}`).toBe(true);
    }
  });

  it('has at least one Unsafe, one Caution and one Stale product', () => {
    expect(products.some((p) => p.safety === 'unsafe')).toBe(true);
    expect(products.some((p) => p.safety === 'caution')).toBe(true);
    expect(products.some((p) => p.isStale)).toBe(true);
  });

  it('has at least 3 products with 2 or more test cycles of history', () => {
    const multiCycle = products.filter((p) => p.premium.scoreHistory.length >= 2);
    expect(multiCycle.length).toBeGreaterThanOrEqual(3);
  });

  it('has at least one product where the label overstates protein in the harmful direction', () => {
    const overstated = products.some((p) =>
      p.premium.labelVsLab.some((row) => row.code === 'protein_g' && row.harmful && row.label > row.lab),
    );
    expect(overstated).toBe(true);
  });

  it('has at least one batch where a detected allergen is not declared on its label', () => {
    const labelById = new Map(LABEL_VERSIONS.map((lv) => [lv.id, lv]));
    const hasUndeclared = TEST_BATCHES.some((batch) => {
      const label = labelById.get(batch.labelVersionId);
      if (!label) return false;
      return batch.allergenDetections.some((code) => !label.allergens.includes(code));
    });
    expect(hasUndeclared).toBe(true);
  });
});
