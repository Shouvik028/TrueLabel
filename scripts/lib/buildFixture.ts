import {
  computeFreshness,
  computeProductScore,
  METHODOLOGY_VERSION,
  type AllergenReading,
  type ContaminantReading,
} from '@truelabel/core';

import type {
  ContaminantResultRow,
  LabelVsLabRow,
  MockFixture,
  ProductDetail,
  ScoreHistoryEntry,
} from '../../apps/mobile/src/data/types';
import {
  ADDITIVES,
  BRANDS,
  CATEGORIES,
  LABEL_VERSION_ADDITIVES,
  LABEL_VERSIONS,
  PRODUCTS,
  PRODUCT_BARCODES,
  TEST_BATCHES,
  TEST_PARAMETERS,
} from '../mock-data/source';

/**
 * Fixed reference date for freshness (SCORING.md §5 — never `Date.now()`).
 * Regenerate the fixture (npm run generate:mock-data) to roll this forward.
 */
export const GENERATED_ASOF = '2026-09-27';

/**
 * computeSafety compares AllergenReading.allergenCode directly against
 * label_versions.allergens (bare names, e.g. 'peanut' — see safety.test.ts
 * V8), not the `allergen_<name>` test_parameters.code convention.
 */
const ALLERGEN_CODES = TEST_PARAMETERS.filter((p) => p.kind === 'allergen').map((p) =>
  p.code.replace(/^allergen_/, ''),
);

export function buildFixture(): MockFixture {
  const brandsById = new Map(BRANDS.map((b) => [b.id, b]));
  const categoriesById = new Map(CATEGORIES.map((c) => [c.id, c]));
  const additivesById = new Map(ADDITIVES.map((a) => [a.id, a]));
  const testParametersByCode = new Map(TEST_PARAMETERS.map((p) => [p.code, p]));

  const barcodesByProduct = new Map<string, string[]>();
  for (const { productId, barcode } of PRODUCT_BARCODES) {
    const list = barcodesByProduct.get(productId) ?? [];
    list.push(barcode);
    barcodesByProduct.set(productId, list);
  }

  const batchesByProduct = new Map<string, typeof TEST_BATCHES>();
  for (const batch of TEST_BATCHES) {
    const list = batchesByProduct.get(batch.productId) ?? [];
    list.push(batch);
    batchesByProduct.set(batch.productId, list);
  }
  for (const list of batchesByProduct.values()) {
    list.sort((a, b) => a.cycleNumber - b.cycleNumber);
  }

  const products: ProductDetail[] = PRODUCTS.map((product) => {
    const brand = brandsById.get(product.brandId);
    const category = categoriesById.get(product.categoryId);
    if (!brand) throw new Error(`unknown brand ${product.brandId} for ${product.id}`);
    if (!category) throw new Error(`unknown category ${product.categoryId} for ${product.id}`);
    if (!category.benchmarks) throw new Error(`category ${category.id} has no benchmarks`);

    const label = LABEL_VERSIONS.find((lv) => lv.productId === product.id && lv.isCurrent);
    if (!label) throw new Error(`no current label version for ${product.id}`);

    const additiveConcernLevels = LABEL_VERSION_ADDITIVES.filter(
      (link) => link.labelVersionId === label.id,
    ).map((link) => {
      const additive = additivesById.get(link.additiveId);
      if (!additive) throw new Error(`unknown additive ${link.additiveId}`);
      return additive.concern;
    });

    const batches = batchesByProduct.get(product.id) ?? [];
    if (batches.length === 0) throw new Error(`no test batches for ${product.id}`);

    const history: ScoreHistoryEntry[] = [];
    let latestLabelVsLab: LabelVsLabRow[] = [];
    let latestContaminants: ContaminantResultRow[] = [];

    for (const batch of batches) {
      const contaminants: ContaminantReading[] = batch.contaminants.map((c) => ({
        parameterCode: c.parameterCode,
        value: c.value,
        belowDetection: c.belowDetection,
        limit: testParametersByCode.get(c.parameterCode)?.fssaiLimit ?? null,
      }));

      const allergens: AllergenReading[] = ALLERGEN_CODES.map((allergenCode) => ({
        allergenCode,
        detected: batch.allergenDetections.includes(allergenCode),
      }));

      const result = computeProductScore({
        contaminants,
        allergens,
        declaredAllergens: label.allergens,
        label: label.nutrients,
        lab: batch.nutrients,
        benchmarks: category.benchmarks,
        additives: additiveConcernLevels,
        processingLevel: label.processingLevel,
      });

      if (!result.ok) {
        throw new Error(`${product.id} batch ${batch.id} failed to score: ${result.errors.join(', ')}`);
      }

      const { safety, labelAccuracy, foodGrade } = result.score;
      // computeProductScore only returns `ok: true` when both nested results
      // are themselves `ok: true` (see packages/core/src/scoring/productScore.ts),
      // but ProductScoreBreakdown types them as the full union — narrow here.
      if (!safety.ok) throw new Error(`${product.id} batch ${batch.id}: safety not ok`);
      if (!foodGrade.ok) throw new Error(`${product.id} batch ${batch.id}: foodGrade not ok`);

      history.push({
        batchId: batch.id,
        cycleNumber: batch.cycleNumber,
        publishedAt: batch.purchaseDate,
        grade: foodGrade.grade,
        gradeComposite: foodGrade.composite,
        labelAccuracy: labelAccuracy.las,
        accuracyBand: labelAccuracy.band,
        safety: safety.status,
      });

      latestLabelVsLab = labelAccuracy.nutrients.map((n) => ({
        code: n.code,
        label: n.label,
        lab: n.lab,
        deviationPct: n.deviationPct,
        direction: n.direction,
        harmful: n.harmful,
        subScore: n.subScore,
      }));
      latestContaminants = safety.contaminants.map((c) => ({
        parameterCode: c.parameterCode,
        value: c.value,
        belowDetection: c.belowDetection,
        limit: c.limit,
        ratio: c.ratio,
      }));
    }

    // Latest cycle (batches sorted ascending) is the current published state.
    const latest = history[history.length - 1]!;
    const latestBatch = batches[batches.length - 1]!;
    const freshness = computeFreshness({
      purchaseDate: latestBatch.purchaseDate,
      testFrequencyMonths: product.testFrequencyMonths,
      asOf: GENERATED_ASOF,
    });

    const detail: ProductDetail = {
      id: product.id,
      brandId: brand.id,
      brandName: brand.name,
      categoryId: category.id,
      categorySlug: category.slug,
      name: product.name,
      variant: product.variant,
      packSize: product.packSize,
      imageUrls: product.imageUrls,
      grade: latest.grade,
      gradeComposite: latest.gradeComposite,
      labelAccuracy: latest.labelAccuracy,
      accuracyBand: latest.accuracyBand,
      safety: latest.safety,
      publishedAt: latest.publishedAt,
      nextTestDue: freshness.nextTestDue,
      isStale: freshness.isStale,
      barcodes: barcodesByProduct.get(product.id) ?? [],
      labelVersion: {
        servingSizeG: label.servingSizeG,
        ingredientsText: label.ingredientsText,
        allergens: label.allergens,
        claims: label.claims,
        fssaiLicenseNo: label.fssaiLicenseNo,
        vegMark: label.vegMark,
        processingLevel: label.processingLevel,
        capturedAt: label.capturedAt,
      },
      premium: {
        labelVsLab: latestLabelVsLab,
        contaminants: latestContaminants,
        labReportPath: null,
        scoreHistory: [...history].reverse(),
      },
    };

    return detail;
  });

  return {
    methodologyVersion: METHODOLOGY_VERSION,
    generatedAsOf: GENERATED_ASOF,
    products,
  };
}
