/** WCAG 2.x relative luminance and contrast ratio, for hex colours like "#RRGGBB". */

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const match = /^#(?<value>[0-9a-fA-F]{6})$/.exec(hex);
  const value = match?.groups?.['value'];
  if (!value) {
    throw new Error(`Expected a 6-digit hex colour, got "${hex}"`);
  }
  const r = srgbToLinear(parseInt(value.slice(0, 2), 16));
  const g = srgbToLinear(parseInt(value.slice(2, 4), 16));
  const b = srgbToLinear(parseInt(value.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours, in the range [1, 21]. */
export function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexA);
  const lB = relativeLuminance(hexB);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}
