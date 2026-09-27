import type { AccuracyBand, Grade, NutrientCode, SafetyStatus, VegMark } from '@truelabel/core';

/**
 * Mirrors ARCHITECTURE.md §5 `product_public` view — one row per active
 * product with its latest non-superseded published score. Readable by
 * guests; this is what search/list/alternatives return.
 */
export interface ProductPublicRow {
  id: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categorySlug: string;
  name: string;
  variant: string | null;
  packSize: string | null;
  imageUrls: string[];
  grade: Grade;
  gradeComposite: number;
  labelAccuracy: number | null;
  accuracyBand: AccuracyBand;
  safety: SafetyStatus;
  publishedAt: string;
  nextTestDue: string;
  isStale: boolean;
}

export type ProductSummary = ProductPublicRow;

export interface LabelVsLabRow {
  code: NutrientCode;
  label: number;
  lab: number;
  deviationPct: number | null;
  direction: 'over' | 'under' | 'none';
  harmful: boolean;
  subScore: number;
}

export interface ContaminantResultRow {
  parameterCode: string;
  value: number;
  belowDetection: boolean;
  limit: number | null;
  ratio: number | null;
}

export interface ScoreHistoryEntry {
  batchId: string;
  cycleNumber: number;
  publishedAt: string;
  grade: Grade;
  gradeComposite: number;
  labelAccuracy: number | null;
  accuracyBand: AccuracyBand;
  safety: SafetyStatus;
}

/**
 * Mirrors ARCHITECTURE.md §5 `product_premium_detail` view — label-vs-lab
 * values, contaminant results, lab report path and score history.
 * Premium-gated in Phase 3; the mock repository returns it unconditionally
 * since premium gating isn't wired up yet (Phase 2).
 */
export interface ProductPremiumDetail {
  labelVsLab: LabelVsLabRow[];
  contaminants: ContaminantResultRow[];
  labReportPath: string | null;
  scoreHistory: ScoreHistoryEntry[];
}

export interface LabelVersionSummary {
  servingSizeG: number | null;
  ingredientsText: string | null;
  allergens: string[];
  claims: string[];
  fssaiLicenseNo: string | null;
  vegMark: VegMark;
  processingLevel: 1 | 2 | 3 | 4;
  capturedAt: string;
}

export interface ProductDetail extends ProductPublicRow {
  barcodes: string[];
  labelVersion: LabelVersionSummary;
  premium: ProductPremiumDetail;
}

export interface ProductFilters {
  categoryId?: string;
  grade?: Grade;
  safety?: SafetyStatus;
  accuracyBand?: AccuracyBand;
}

export type SortKey = 'grade' | 'accuracy' | 'recentlyTested';

/** ARCHITECTURE.md §4 — screens call hooks, hooks call the active repository. */
export interface ProductRepository {
  search(query: string, filters?: ProductFilters): Promise<ProductSummary[]>;
  getById(id: string): Promise<ProductDetail | null>;
  getByBarcode(barcode: string): Promise<ProductSummary | null>;
  listByCategory(categoryId: string, sort?: SortKey): Promise<ProductSummary[]>;
  getScoreHistory(productId: string): Promise<ScoreHistoryEntry[]>;
  getAlternatives(productId: string, limit: number): Promise<ProductSummary[]>;
}

export interface MockFixture {
  methodologyVersion: string;
  generatedAsOf: string;
  products: ProductDetail[];
}
