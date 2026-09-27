import { describe, expect, it } from 'vitest';
import { computeFreshness } from './freshness';

describe('computeFreshness', () => {
  it('V10 — due date and the 30-day stale grace period', () => {
    const dueDate = computeFreshness({
      purchaseDate: '2026-01-10',
      testFrequencyMonths: 2,
      asOf: '2026-01-10',
    }).nextTestDue;
    expect(dueDate).toBe('2026-03-10');

    const notStale = computeFreshness({
      purchaseDate: '2026-01-10',
      testFrequencyMonths: 2,
      asOf: '2026-04-09',
    });
    expect(notStale.isStale).toBe(false);

    const stale = computeFreshness({
      purchaseDate: '2026-01-10',
      testFrequencyMonths: 2,
      asOf: '2026-04-10',
    });
    expect(stale.isStale).toBe(true);
  });

  it('rejects a non-ISO-date string', () => {
    expect(() =>
      computeFreshness({ purchaseDate: '10 Jan 2026', testFrequencyMonths: 2, asOf: '2026-04-09' }),
    ).toThrow();
    expect(() =>
      computeFreshness({ purchaseDate: '2026-01-10', testFrequencyMonths: 2, asOf: 'not-a-date' }),
    ).toThrow();
  });
});
