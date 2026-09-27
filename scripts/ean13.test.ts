import { describe, expect, it } from 'vitest';

import { buildEan13, ean13CheckDigit, isValidEan13 } from './lib/ean13';
import { PRODUCT_BARCODES } from './mock-data/source/products';

describe('ean13CheckDigit', () => {
  it('matches a known GS1 example (barcode 4006381333931)', () => {
    expect(ean13CheckDigit('400638133393')).toBe(1);
  });

  it('rejects input that is not exactly 12 digits', () => {
    expect(() => ean13CheckDigit('12345')).toThrow();
    expect(() => ean13CheckDigit('12345678901234')).toThrow();
    expect(() => ean13CheckDigit('12345678901x')).toThrow();
  });
});

describe('isValidEan13', () => {
  it('accepts a code built by buildEan13', () => {
    const code = buildEan13('890000000001');
    expect(isValidEan13(code)).toBe(true);
  });

  it('rejects a wrong check digit, wrong length, or non-digits', () => {
    const code = buildEan13('890000000001');
    const lastDigit = Number(code[12]);
    const wrongCheckDigit = `${code.slice(0, 12)}${(lastDigit + 1) % 10}`;
    expect(isValidEan13(wrongCheckDigit)).toBe(false);
    expect(isValidEan13('890000000001')).toBe(false); // 12 digits, not 13
    expect(isValidEan13(`${code.slice(0, 12)}x`)).toBe(false);
  });
});

describe('mock product barcodes', () => {
  it('are all valid EAN-13 codes starting with the 890 (GS1 India) prefix', () => {
    expect(PRODUCT_BARCODES.length).toBeGreaterThan(0);
    for (const { barcode, productId } of PRODUCT_BARCODES) {
      expect(barcode, `${productId} barcode`).toMatch(/^890\d{10}$/);
      expect(isValidEan13(barcode), `${productId} barcode ${barcode} check digit`).toBe(true);
    }
  });

  it('has no duplicate barcodes', () => {
    const barcodes = PRODUCT_BARCODES.map((b) => b.barcode);
    expect(new Set(barcodes).size).toBe(barcodes.length);
  });
});
