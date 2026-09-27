import type { ProcessingLevel, VegMark } from './enums';
import type { NutrientCode, NutritionSubscoreCode } from './testResult';

export interface Brand {
  id: string;
  name: string;
  logoUrl: string | null;
  country: string;
  website: string | null;
}

export interface CategoryBenchmarkEntry {
  good: number;
  poor: number;
}

/** ARCHITECTURE.md §5 `categories.benchmarks` — keyed by the 6 nutrition sub-score nutrients. */
export type CategoryBenchmarks = Partial<Record<NutritionSubscoreCode, CategoryBenchmarkEntry>>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  benchmarks: CategoryBenchmarks | null;
}

export type ProductStatus = 'draft' | 'active' | 'discontinued';

export interface Product {
  id: string;
  brandId: string;
  categoryId: string;
  name: string;
  variant: string | null;
  packSize: string | null;
  imageUrls: string[];
  testFrequencyMonths: 1 | 2 | 3;
  status: ProductStatus;
  nextTestDue: string | null;
}

export interface LabelVersion {
  id: string;
  productId: string;
  version: number;
  isCurrent: boolean;
  servingSizeG: number | null;
  /** Per-100g declared nutrients, keyed by parameter code (SCORING.md §3.1). */
  nutrients: Partial<Record<NutrientCode, number>>;
  ingredientsText: string | null;
  allergens: string[];
  claims: string[];
  fssaiLicenseNo: string | null;
  vegMark: VegMark;
  processingLevel: ProcessingLevel;
  capturedAt: string;
  photoPaths: string[];
}
