import type { Grade } from '@truelabel/core';

import type {
  MockFixture,
  ProductDetail,
  ProductFilters,
  ProductRepository,
  ProductSummary,
  ScoreHistoryEntry,
  SortKey,
} from '../types';
import fixture from './fixture.json';

const FIXTURE = fixture as MockFixture;

const GRADE_RANK: Record<Grade, number> = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 };

function toSummary(product: ProductDetail): ProductSummary {
  const { barcodes: _barcodes, labelVersion: _labelVersion, premium: _premium, ...summary } = product;
  return summary;
}

function matchesFilters(product: ProductDetail, filters?: ProductFilters): boolean {
  if (!filters) return true;
  if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
  if (filters.grade && product.grade !== filters.grade) return false;
  if (filters.safety && product.safety !== filters.safety) return false;
  if (filters.accuracyBand && product.accuracyBand !== filters.accuracyBand) return false;
  return true;
}

function sortSummaries(products: ProductSummary[], sort?: SortKey): ProductSummary[] {
  const sorted = [...products];
  switch (sort) {
    case 'grade':
      return sorted.sort((a, b) => GRADE_RANK[a.grade] - GRADE_RANK[b.grade]);
    case 'accuracy':
      return sorted.sort((a, b) => (b.labelAccuracy ?? -1) - (a.labelAccuracy ?? -1));
    case 'recentlyTested':
      return sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    default:
      return sorted;
  }
}

/**
 * Reads apps/mobile/src/data/mock/fixture.json, generated from
 * scripts/mock-data/source by `npm run generate:mock-data` — the mobile app
 * never scores products itself (CLAUDE.md hard constraint #4).
 */
export class MockProductRepository implements ProductRepository {
  async search(query: string, filters?: ProductFilters): Promise<ProductSummary[]> {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = FIXTURE.products.filter((product) => {
      if (!matchesFilters(product, filters)) return false;
      if (normalizedQuery.length === 0) return true;
      const haystack = `${product.name} ${product.brandName} ${product.variant ?? ''}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
    return matches.map(toSummary);
  }

  async getById(id: string): Promise<ProductDetail | null> {
    return FIXTURE.products.find((product) => product.id === id) ?? null;
  }

  async getByBarcode(barcode: string): Promise<ProductSummary | null> {
    const product = FIXTURE.products.find((p) => p.barcodes.includes(barcode));
    return product ? toSummary(product) : null;
  }

  async listByCategory(categoryId: string, sort?: SortKey): Promise<ProductSummary[]> {
    const matches = FIXTURE.products.filter((p) => p.categoryId === categoryId).map(toSummary);
    return sortSummaries(matches, sort);
  }

  async getScoreHistory(productId: string): Promise<ScoreHistoryEntry[]> {
    const product = FIXTURE.products.find((p) => p.id === productId);
    return product?.premium.scoreHistory ?? [];
  }

  async getAlternatives(productId: string, limit: number): Promise<ProductSummary[]> {
    const product = FIXTURE.products.find((p) => p.id === productId);
    if (!product) return [];
    const alternatives = FIXTURE.products
      .filter((p) => p.id !== productId && p.categoryId === product.categoryId)
      .map(toSummary)
      .sort((a, b) => GRADE_RANK[a.grade] - GRADE_RANK[b.grade]);
    return alternatives.slice(0, limit);
  }
}

export const ALL_MOCK_PRODUCTS: ProductSummary[] = FIXTURE.products.map(toSummary);
