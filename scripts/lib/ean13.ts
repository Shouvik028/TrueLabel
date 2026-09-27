/**
 * EAN-13 check digit (GS1 general specification): weight 1 on positions
 * 1,3,...,11 (odd, 1-indexed) and weight 3 on positions 2,4,...,12 (even),
 * over the first 12 digits; check = (10 - sum % 10) % 10.
 */
export function ean13CheckDigit(digits12: string): number {
  if (!/^\d{12}$/.test(digits12)) {
    throw new Error(`expected 12 digits, got ${digits12}`);
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = Number(digits12[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  return (10 - (sum % 10)) % 10;
}

/** Builds a full 13-digit EAN-13 by appending the computed check digit. */
export function buildEan13(digits12: string): string {
  return `${digits12}${ean13CheckDigit(digits12)}`;
}

export function isValidEan13(code: string): boolean {
  if (!/^\d{13}$/.test(code)) return false;
  return ean13CheckDigit(code.slice(0, 12)) === Number(code[12]);
}
