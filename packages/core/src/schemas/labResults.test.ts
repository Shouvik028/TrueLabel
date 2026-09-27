import { describe, expect, it } from 'vitest';
import { testResultRowSchema, testResultsSchema } from './labResults';

const validRow = {
  batchId: 'batch-1',
  parameterCode: 'lead_mg_kg',
  value: 0.2,
  unit: 'mg/kg',
  method: 'ICP-MS',
  belowDetection: false,
};

describe('testResultRowSchema', () => {
  it('accepts a valid row', () => {
    expect(testResultRowSchema.parse(validRow)).toEqual(validRow);
  });

  it('accepts a null method', () => {
    expect(() => testResultRowSchema.parse({ ...validRow, method: null })).not.toThrow();
  });

  it('rejects a negative value', () => {
    expect(() => testResultRowSchema.parse({ ...validRow, value: -0.1 })).toThrow();
  });

  it('rejects a non-finite value', () => {
    expect(() =>
      testResultRowSchema.parse({ ...validRow, value: Number.POSITIVE_INFINITY }),
    ).toThrow();
    expect(() => testResultRowSchema.parse({ ...validRow, value: Number.NaN })).toThrow();
  });

  it('rejects a missing parameterCode', () => {
    const withoutCode: Record<string, unknown> = { ...validRow };
    delete withoutCode.parameterCode;
    expect(() => testResultRowSchema.parse(withoutCode)).toThrow();
  });
});

describe('testResultsSchema', () => {
  it('validates an array of rows', () => {
    expect(testResultsSchema.parse([validRow, validRow])).toHaveLength(2);
  });
});
