import { DEFAULT_CATEGORY_BENCHMARKS, type Category } from '@truelabel/core';

/**
 * Benchmarks come straight from packages/core's placeholder config
 * (SCORING.md §4.1) so the mock catalogue and the scoring engine can never
 * disagree about what "good"/"poor" mean for these categories.
 */
export const CATEGORIES: Category[] = [
  {
    id: 'cat-whey-protein',
    name: 'Whey protein',
    slug: 'whey-protein',
    parentId: null,
    benchmarks: DEFAULT_CATEGORY_BENCHMARKS['whey-protein'] ?? null,
  },
  {
    id: 'cat-protein-bars',
    name: 'Protein bars',
    slug: 'protein-bars',
    parentId: null,
    benchmarks: DEFAULT_CATEGORY_BENCHMARKS['protein-bars'] ?? null,
  },
];
