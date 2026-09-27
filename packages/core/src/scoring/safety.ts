import type { ParameterCode } from '../types/testResult';
import type { SafetyStatus } from '../types/enums';
import { SAFETY_CAUTION_RATIO, SAFETY_UNSAFE_RATIO } from './config';
import { assertValidMeasurement } from './util';

export interface ContaminantReading {
  parameterCode: ParameterCode;
  value: number;
  belowDetection: boolean;
  /** FSSAI limit for this parameter (after any category override), or null if none is set. */
  limit: number | null;
}

export interface AllergenReading {
  allergenCode: string;
  detected: boolean;
}

export interface ComputeSafetyInput {
  contaminants: ContaminantReading[];
  allergens: AllergenReading[];
  /** Allergens declared on the current label version. */
  declaredAllergens: string[];
}

/** A contaminant result annotated with its scored ratio, for display (SCORING.md §2). */
export interface ContaminantDisplay {
  parameterCode: ParameterCode;
  value: number;
  belowDetection: boolean;
  limit: number | null;
  /** value / limit, or null when this parameter has no limit and was not scored. */
  ratio: number | null;
}

export type SafetyTrigger =
  | { kind: 'contaminant'; parameterCode: ParameterCode; ratio: number; level: 'caution' | 'unsafe' }
  | { kind: 'allergen'; allergenCode: string; level: 'caution' };

export type SafetyResult =
  | {
      ok: true;
      status: SafetyStatus;
      /** The worst ratio among contaminants that have a limit. */
      worstRatio: number;
      triggers: SafetyTrigger[];
      contaminants: ContaminantDisplay[];
    }
  | { ok: false; error: 'INSUFFICIENT_SAFETY_DATA' };

/**
 * SCORING.md §2. Publishing requires at least one contaminant result WITH a
 * limit — contaminants without a limit are returned in `contaminants` for
 * display but are not scored (DECISIONS.md #11).
 */
export function computeSafety(input: ComputeSafetyInput): SafetyResult {
  for (const c of input.contaminants) {
    assertValidMeasurement(c.value, `contaminant ${c.parameterCode} value`);
    if (c.limit !== null) {
      assertValidMeasurement(c.limit, `contaminant ${c.parameterCode} limit`);
      if (c.limit === 0) {
        throw new Error(`contaminant ${c.parameterCode} limit must not be zero`);
      }
    }
  }

  const contaminants: ContaminantDisplay[] = input.contaminants.map((c) => ({
    parameterCode: c.parameterCode,
    value: c.value,
    belowDetection: c.belowDetection,
    limit: c.limit,
    ratio: c.limit === null ? null : c.belowDetection ? 0 : c.value / c.limit,
  }));

  const scored = contaminants.filter(
    (c): c is ContaminantDisplay & { ratio: number } => c.ratio !== null,
  );

  if (scored.length === 0) {
    return { ok: false, error: 'INSUFFICIENT_SAFETY_DATA' };
  }

  const triggers: SafetyTrigger[] = [];
  let worstRatio = 0;

  for (const c of scored) {
    if (c.ratio > worstRatio) worstRatio = c.ratio;
    if (c.ratio > SAFETY_UNSAFE_RATIO) {
      triggers.push({ kind: 'contaminant', parameterCode: c.parameterCode, ratio: c.ratio, level: 'unsafe' });
    } else if (c.ratio > SAFETY_CAUTION_RATIO) {
      triggers.push({ kind: 'contaminant', parameterCode: c.parameterCode, ratio: c.ratio, level: 'caution' });
    }
  }

  for (const a of input.allergens) {
    if (a.detected && !input.declaredAllergens.includes(a.allergenCode)) {
      triggers.push({ kind: 'allergen', allergenCode: a.allergenCode, level: 'caution' });
    }
  }

  const status: SafetyStatus = triggers.some((t) => t.level === 'unsafe')
    ? 'unsafe'
    : triggers.some((t) => t.level === 'caution')
      ? 'caution'
      : 'safe';

  return { ok: true, status, worstRatio, triggers, contaminants };
}
