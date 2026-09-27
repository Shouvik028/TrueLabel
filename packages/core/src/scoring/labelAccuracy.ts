import type { AccuracyBand } from '../types/enums';
import type { NutrientCode } from '../types/testResult';
import { NUTRIENT_CODES } from '../types/testResult';
import {
  ACCURACY_BAND_THRESHOLDS,
  LABEL_ACCURACY_HARMFUL_MULTIPLIER,
  LABEL_ACCURACY_MIN_NUTRIENTS,
  LABEL_ACCURACY_NUTRIENTS,
} from './config';
import { assertValidMeasurement, clamp, round1 } from './util';

export interface LabelAccuracyNutrientDetail {
  code: NutrientCode;
  label: number;
  lab: number;
  /** Raw relative deviation, as a percentage, before the harmful multiplier. Null when label = 0. */
  deviationPct: number | null;
  direction: 'over' | 'under' | 'none';
  harmful: boolean;
  /** s_i, un-rounded (SCORING.md §6 compares sub-scores with 1e-9 tolerance). */
  subScore: number;
}

export interface LabelAccuracyResult {
  /** Rounded to 1 decimal (round1); null when fewer than 3 nutrients are present. */
  las: number | null;
  band: AccuracyBand;
  nutrients: LabelAccuracyNutrientDetail[];
}

function bandFromRoundedLas(las: number): AccuracyBand {
  const match = ACCURACY_BAND_THRESHOLDS.find((t) => las >= t.min);
  // ACCURACY_BAND_THRESHOLDS bottoms out at min: 0, so this is always defined.
  return match!.band;
}

/**
 * SCORING.md §3. `label` and `lab` are per-100g values keyed by nutrient
 * code; only the 8 codes with a defined weight (NUTRIENT_CODES) are
 * considered, and only when present in both maps.
 */
export function computeLabelAccuracy(
  label: Partial<Record<NutrientCode, number>>,
  lab: Partial<Record<NutrientCode, number>>,
): LabelAccuracyResult {
  const presentCodes = NUTRIENT_CODES.filter(
    (code) => label[code] !== undefined && lab[code] !== undefined,
  );

  const nutrients: LabelAccuracyNutrientDetail[] = presentCodes.map((code) => {
    const labelValue = label[code] as number;
    const labValue = lab[code] as number;
    assertValidMeasurement(labelValue, `label ${code}`);
    assertValidMeasurement(labValue, `lab ${code}`);

    const cfg = LABEL_ACCURACY_NUTRIENTS[code];
    const direction: 'over' | 'under' | 'none' =
      labValue > labelValue ? 'over' : labValue < labelValue ? 'under' : 'none';
    const harmful = direction !== 'none' && direction === cfg.harmfulDirection;

    let d: number;
    let deviationPct: number | null;
    if (labelValue === 0) {
      d = labValue <= cfg.absoluteToleranceWhenLabelZero ? 0 : Infinity;
      deviationPct = null;
    } else {
      const raw = Math.abs(labValue - labelValue) / labelValue;
      d = harmful ? raw * LABEL_ACCURACY_HARMFUL_MULTIPLIER : raw;
      deviationPct = raw * 100;
    }

    const t = cfg.tolerance;
    const subScore = Number.isFinite(d) ? clamp((100 * (3 * t - d)) / (2 * t), 0, 100) : 0;

    return { code, label: labelValue, lab: labValue, deviationPct, direction, harmful, subScore };
  });

  if (presentCodes.length < LABEL_ACCURACY_MIN_NUTRIENTS) {
    return { las: null, band: 'insufficient_data', nutrients };
  }

  let weightedSum = 0;
  let weightTotal = 0;
  for (const n of nutrients) {
    const weight = LABEL_ACCURACY_NUTRIENTS[n.code].weight;
    weightedSum += weight * n.subScore;
    weightTotal += weight;
  }

  const las = round1(weightedSum / weightTotal);
  return { las, band: bandFromRoundedLas(las), nutrients };
}
