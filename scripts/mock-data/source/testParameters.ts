import type { TestParameter } from '@truelabel/core';

/**
 * SCORING.md §1. Nutrient limits are null (nutrients aren't FSSAI-limited).
 * Contaminant limits below are placeholders, like SCORING.md's benchmarks —
 * not sourced from the FSSAI Contaminants, Toxins and Residues Regulations,
 * 2011 text; a regulatory advisor must confirm real limits before launch
 * (PRD.md §8).
 */
export const TEST_PARAMETERS: TestParameter[] = [
  { code: 'energy_kcal', name: 'Energy', kind: 'nutrient', unit: 'kcal', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'protein_g', name: 'Protein', kind: 'nutrient', unit: 'g', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'carbohydrate_g', name: 'Total carbohydrate', kind: 'nutrient', unit: 'g', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'sugar_g', name: 'Total sugars', kind: 'nutrient', unit: 'g', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'total_fat_g', name: 'Total fat', kind: 'nutrient', unit: 'g', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'sat_fat_g', name: 'Saturated fat', kind: 'nutrient', unit: 'g', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'fibre_g', name: 'Dietary fibre', kind: 'nutrient', unit: 'g', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'sodium_mg', name: 'Sodium', kind: 'nutrient', unit: 'mg', fssaiLimit: null, limitSource: null, categoryOverrides: null },

  { code: 'lead_mg_kg', name: 'Lead', kind: 'contaminant', unit: 'mg/kg', fssaiLimit: 2.5, limitSource: 'placeholder — SCORING.md §1', categoryOverrides: null },
  { code: 'cadmium_mg_kg', name: 'Cadmium', kind: 'contaminant', unit: 'mg/kg', fssaiLimit: 1.5, limitSource: 'placeholder — SCORING.md §1', categoryOverrides: null },
  { code: 'arsenic_mg_kg', name: 'Arsenic', kind: 'contaminant', unit: 'mg/kg', fssaiLimit: 1.1, limitSource: 'placeholder — SCORING.md §1', categoryOverrides: null },
  { code: 'mercury_mg_kg', name: 'Mercury', kind: 'contaminant', unit: 'mg/kg', fssaiLimit: 1.0, limitSource: 'placeholder — SCORING.md §1', categoryOverrides: null },
  { code: 'aflatoxin_ug_kg', name: 'Aflatoxin (total)', kind: 'contaminant', unit: 'µg/kg', fssaiLimit: 15, limitSource: 'placeholder — SCORING.md §1', categoryOverrides: null },

  { code: 'allergen_milk', name: 'Milk', kind: 'allergen', unit: 'presence', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'allergen_peanut', name: 'Peanut', kind: 'allergen', unit: 'presence', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'allergen_soy', name: 'Soy', kind: 'allergen', unit: 'presence', fssaiLimit: null, limitSource: null, categoryOverrides: null },
  { code: 'allergen_tree_nut', name: 'Tree nut', kind: 'allergen', unit: 'presence', fssaiLimit: null, limitSource: null, categoryOverrides: null },
];
