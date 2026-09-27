import type { ConcernLevel } from '@truelabel/core';

export interface AdditiveSource {
  id: string;
  name: string;
  eNumber: string;
  concern: ConcernLevel;
  rationale: string;
  sources: string[];
}

/** Generic, real-world additive names (not brand names) — SCORING.md §4.3 concern levels. */
export const ADDITIVES: AdditiveSource[] = [
  {
    id: 'add-lecithin',
    name: 'Soy lecithin',
    eNumber: 'E322',
    concern: 'low',
    rationale: 'Common emulsifier, generally recognised as safe at typical use levels.',
    sources: [],
  },
  {
    id: 'add-sucralose',
    name: 'Sucralose',
    eNumber: 'E955',
    concern: 'low',
    rationale: 'Artificial sweetener; low concern at typical intake levels.',
    sources: [],
  },
  {
    id: 'add-cellulose-gum',
    name: 'Cellulose gum',
    eNumber: 'E466',
    concern: 'low',
    rationale: 'Common thickener with low concern at typical use levels.',
    sources: [],
  },
  {
    id: 'add-caramel-color',
    name: 'Caramel colour (class IV)',
    eNumber: 'E150d',
    concern: 'moderate',
    rationale: 'Class IV caramel colour may contain trace 4-MEI; moderate concern at high intake.',
    sources: [],
  },
  {
    id: 'add-sodium-benzoate',
    name: 'Sodium benzoate',
    eNumber: 'E211',
    concern: 'moderate',
    rationale: 'Preservative; moderate concern when combined with ascorbic acid (benzene formation risk).',
    sources: [],
  },
  {
    id: 'add-msg',
    name: 'Monosodium glutamate',
    eNumber: 'E621',
    concern: 'moderate',
    rationale: 'Flavour enhancer; moderate concern for sensitive individuals at high intake.',
    sources: [],
  },
  {
    id: 'add-bha',
    name: 'Butylated hydroxyanisole',
    eNumber: 'E320',
    concern: 'high',
    rationale: 'Synthetic antioxidant; classified as a possible carcinogen by some regulators.',
    sources: [],
  },
  {
    id: 'add-tartrazine',
    name: 'Tartrazine',
    eNumber: 'E102',
    concern: 'high',
    rationale: 'Synthetic dye linked to hyperactivity in children in some studies; high concern.',
    sources: [],
  },
];
