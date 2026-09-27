export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Round half away from zero to 1 decimal place. */
export function round1(value: number): number {
  const sign = value < 0 ? -1 : 1;
  return (sign * Math.round(Math.abs(value) * 10)) / 10;
}

/**
 * Every measured/declared value fed into the scoring engine must be a finite,
 * non-negative number — negative, NaN or Infinity values indicate a data bug
 * upstream, not a legitimate business outcome (CLAUDE.md Definition of Done:
 * "negative input rejected").
 */
export function assertValidMeasurement(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number, got ${value}`);
  }
  if (value < 0) {
    throw new Error(`${label} must not be negative, got ${value}`);
  }
}
