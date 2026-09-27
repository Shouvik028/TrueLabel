import { MockProductRepository } from './mock/MockProductRepository';
import type { ProductRepository } from './types';

export * from './types';
export { ALL_MOCK_PRODUCTS } from './mock/MockProductRepository';

let repository: ProductRepository | undefined;

/**
 * ARCHITECTURE.md §4/§7 — EXPO_PUBLIC_DATA_SOURCE switch. Unset or any value
 * other than 'supabase' falls back to mock; Supabase lands in Phase 3.
 */
export function getProductRepository(): ProductRepository {
  if (!repository) {
    const source = process.env.EXPO_PUBLIC_DATA_SOURCE;
    if (source === 'supabase') {
      throw new Error(
        'EXPO_PUBLIC_DATA_SOURCE=supabase is not implemented until Phase 3 (ARCHITECTURE.md §4). Use mock.',
      );
    }
    repository = new MockProductRepository();
  }
  return repository;
}
