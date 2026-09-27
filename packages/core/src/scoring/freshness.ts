import { FRESHNESS_STALE_GRACE_DAYS } from './config';

export interface ComputeFreshnessInput {
  /** ISO date (YYYY-MM-DD) of the latest published batch's purchase date. */
  purchaseDate: string;
  testFrequencyMonths: 1 | 2 | 3;
  /** ISO date (YYYY-MM-DD) to evaluate staleness against. Caller passes this in — never Date.now(). */
  asOf: string;
}

export interface FreshnessResult {
  /** ISO date (YYYY-MM-DD). */
  nextTestDue: string;
  isStale: boolean;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseIsoDateUtc(iso: string): Date {
  if (!ISO_DATE_PATTERN.test(iso)) {
    throw new Error(`expected an ISO date (YYYY-MM-DD), got ${iso}`);
  }
  // Date-only ISO strings are parsed as UTC midnight per the ECMA-262 Date Time String Format.
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`invalid date: ${iso}`);
  }
  return date;
}

function addMonthsUtc(date: Date, months: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()));
}

function addDaysUtc(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** SCORING.md §5. */
export function computeFreshness(input: ComputeFreshnessInput): FreshnessResult {
  const purchase = parseIsoDateUtc(input.purchaseDate);
  const asOf = parseIsoDateUtc(input.asOf);

  const nextTestDue = addMonthsUtc(purchase, input.testFrequencyMonths);
  const staleThreshold = addDaysUtc(nextTestDue, FRESHNESS_STALE_GRACE_DAYS);
  const isStale = asOf.getTime() > staleThreshold.getTime();

  return { nextTestDue: toIsoDate(nextTestDue), isStale };
}
