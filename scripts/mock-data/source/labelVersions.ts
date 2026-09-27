import type { LabelVersion } from '@truelabel/core';

export interface LabelVersionAdditiveLink {
  labelVersionId: string;
  additiveId: string;
}

const FSSAI_LICENSE: Record<string, string> = {
  'brand-demo-nutrition': '10019051000123',
  'brand-sample-foods': '10019051000456',
  'brand-northline-wellness': '10019051000789',
  'brand-purecycle-foods': '10019051000234',
  'brand-anchorpoint-nutrition': '10019051000567',
};

const CAPTURED_AT = '2026-01-05';

/**
 * One current label version per product (version 1). Every test cycle for a
 * product is scored against this same declared label, matching how a
 * still-unchanged package would be re-tested each cycle.
 */
export const LABEL_VERSIONS: LabelVersion[] = [
  {
    id: 'lv-w01', productId: 'prod-w01', version: 1, isCurrent: true, servingSizeG: 30,
    nutrients: { energy_kcal: 410.0, protein_g: 68.4, carbohydrate_g: 8.4, sugar_g: 4.57, total_fat_g: 7.35, sat_fat_g: 2.13, fibre_g: 2.42, sodium_mg: 204.8 },
    ingredientsText: 'Whey protein isolate, cocoa powder, natural flavour, sucralose.',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-demo-nutrition']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-w02', productId: 'prod-w02', version: 1, isCurrent: true, servingSizeG: 30,
    nutrients: { energy_kcal: 489.3, protein_g: 52.7, carbohydrate_g: 9.2, sugar_g: 10.18, total_fat_g: 8.05, sat_fat_g: 4.34, fibre_g: 0.89, sodium_mg: 396.75 },
    ingredientsText: 'Whey protein concentrate, vanilla flavour, natural sweetener.',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-sample-foods']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-w03', productId: 'prod-w03', version: 1, isCurrent: true, servingSizeG: 33,
    nutrients: { energy_kcal: 531, protein_g: 45.1, carbohydrate_g: 9.44, sugar_g: 14.16, total_fat_g: 8.26, sat_fat_g: 5.9, fibre_g: 0, sodium_mg: 531 },
    ingredientsText: 'Whey protein blend, instant coffee, cocoa powder, natural flavour.',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-northline-wellness']!,
    vegMark: 'veg', processingLevel: 2, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-w04', productId: 'prod-w04', version: 1, isCurrent: true, servingSizeG: 30,
    nutrients: { energy_kcal: 562.5, protein_g: 41.25, carbohydrate_g: 10, sugar_g: 15, total_fat_g: 8.75, sat_fat_g: 6.25, fibre_g: 0, sodium_mg: 562.5 },
    ingredientsText: 'Whey protein isolate, soy lecithin.',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-purecycle-foods']!,
    vegMark: 'veg', processingLevel: 3, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-w05', productId: 'prod-w05', version: 1, isCurrent: true, servingSizeG: 33,
    nutrients: { energy_kcal: 517.5, protein_g: 46.75, carbohydrate_g: 9.2, sugar_g: 13.8, total_fat_g: 8.05, sat_fat_g: 5.75, fibre_g: 0, sodium_mg: 517.5 },
    ingredientsText: 'Whey protein concentrate, mango flavour, caramel colour (class IV), BHA (antioxidant).',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-anchorpoint-nutrition']!,
    vegMark: 'veg', processingLevel: 4, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-w06', productId: 'prod-w06', version: 1, isCurrent: true, servingSizeG: 30,
    nutrients: { energy_kcal: 435.75, protein_g: 61.75, carbohydrate_g: 8.4, sugar_g: 7.88, total_fat_g: 7.35, sat_fat_g: 3.41, fibre_g: 1.43, sodium_mg: 315 },
    ingredientsText: 'Whey protein isolate, cocoa powder, natural flavour.',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-demo-nutrition']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-w07', productId: 'prod-w07', version: 1, isCurrent: true, servingSizeG: 30,
    nutrients: { energy_kcal: 457.13, protein_g: 59.5, carbohydrate_g: 9.2, sugar_g: 6.04, total_fat_g: 8.05, sat_fat_g: 2.73, fibre_g: 1.91, sodium_mg: 258.75 },
    ingredientsText: 'Whey protein isolate, strawberry flavour, natural colour.',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-sample-foods']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-w08', productId: 'prod-w08', version: 1, isCurrent: true, servingSizeG: 30,
    nutrients: { energy_kcal: 439.43, protein_g: 60.8, carbohydrate_g: 8.4, sugar_g: 8.35, total_fat_g: 7.35, sat_fat_g: 3.60, fibre_g: 1.28, sodium_mg: 330.75 },
    ingredientsText: 'Whey protein concentrate, cocoa powder, natural flavour.',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-northline-wellness']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-w09', productId: 'prod-w09', version: 1, isCurrent: true, servingSizeG: 30,
    // Only 2 of the 8 weighted nutrients are declared on this label — SCORING.md §3.2 "insufficient_data".
    nutrients: { energy_kcal: 468.83, protein_g: 53.2 },
    ingredientsText: 'Whey protein blend, vanilla flavour.',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-purecycle-foods']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-w10', productId: 'prod-w10', version: 1, isCurrent: true, servingSizeG: 30,
    // Protein overstated on the label (label 74.25 g vs lab 55 g) — the harmful direction (SCORING.md §3.1).
    nutrients: { energy_kcal: 531, protein_g: 74.25, carbohydrate_g: 9.44, sugar_g: 14.16, total_fat_g: 8.26, sat_fat_g: 5.9, fibre_g: 0, sodium_mg: 531 },
    ingredientsText: 'Whey protein concentrate, butterscotch flavour, soy lecithin, MSG (flavour enhancer).',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-anchorpoint-nutrition']!,
    vegMark: 'veg', processingLevel: 2, capturedAt: CAPTURED_AT, photoPaths: [],
  },

  {
    id: 'lv-b01', productId: 'prod-b01', version: 1, isCurrent: true, servingSizeG: 60,
    nutrients: { energy_kcal: 562.5, protein_g: 7.5, carbohydrate_g: 50, sugar_g: 25, total_fat_g: 18.75, sat_fat_g: 10, fibre_g: 1.5, sodium_mg: 625 },
    ingredientsText: 'Peanuts, protein blend (whey, milk), caramel colour (class IV), MSG (flavour enhancer).',
    allergens: ['peanut', 'milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-demo-nutrition']!,
    vegMark: 'veg', processingLevel: 4, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-b02', productId: 'prod-b02', version: 1, isCurrent: true, servingSizeG: 60,
    nutrients: { energy_kcal: 517.5, protein_g: 8.5, carbohydrate_g: 46, sugar_g: 23, total_fat_g: 17.25, sat_fat_g: 9.2, fibre_g: 1.7, sodium_mg: 575 },
    ingredientsText: 'Protein blend (whey, soy), chocolate fudge, tartrazine (colour), caramel colour (class IV).',
    allergens: ['milk', 'soy'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-sample-foods']!,
    vegMark: 'veg', processingLevel: 4, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-b03', productId: 'prod-b03', version: 1, isCurrent: true, servingSizeG: 60,
    nutrients: { energy_kcal: 462, protein_g: 10.93, carbohydrate_g: 42, sugar_g: 19.43, total_fat_g: 15.75, sat_fat_g: 7.77, fibre_g: 2.47, sodium_mg: 488.25 },
    ingredientsText: 'Almonds, protein blend (whey, milk), sodium benzoate (preservative).',
    allergens: ['milk', 'tree_nut'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-northline-wellness']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-b04', productId: 'prod-b04', version: 1, isCurrent: true, servingSizeG: 55,
    nutrients: { energy_kcal: 471.5, protein_g: 13.6, carbohydrate_g: 46, sugar_g: 16.1, total_fat_g: 17.25, sat_fat_g: 6.44, fibre_g: 3.74, sodium_mg: 414 },
    ingredientsText: 'Desiccated coconut, protein blend (whey, soy), natural flavour.',
    allergens: ['milk', 'soy'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-purecycle-foods']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-b05', productId: 'prod-b05', version: 1, isCurrent: true, servingSizeG: 60,
    nutrients: { energy_kcal: 378, protein_g: 22.33, carbohydrate_g: 42, sugar_g: 6.83, total_fat_g: 15.75, sat_fat_g: 2.73, fibre_g: 7.03, sodium_mg: 194.25 },
    ingredientsText: 'Protein blend (whey, soy), cocoa powder, dark chocolate.',
    allergens: ['milk', 'soy'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-anchorpoint-nutrition']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-b06', productId: 'prod-b06', version: 1, isCurrent: true, servingSizeG: 60,
    nutrients: { energy_kcal: 531, protein_g: 8.2, carbohydrate_g: 47.2, sugar_g: 23.6, total_fat_g: 17.7, sat_fat_g: 9.44, fibre_g: 1.64, sodium_mg: 590 },
    ingredientsText: 'Protein blend (whey, milk), caramel colour (class IV), cellulose gum (thickener).',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-demo-nutrition']!,
    vegMark: 'veg', processingLevel: 3, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-b07', productId: 'prod-b07', version: 1, isCurrent: true, servingSizeG: 55,
    nutrients: { energy_kcal: 420, protein_g: 16.63, carbohydrate_g: 42, sugar_g: 13.13, total_fat_g: 15.75, sat_fat_g: 5.25, fibre_g: 4.75, sodium_mg: 341.25 },
    ingredientsText: 'Protein blend (whey, soy), mixed berries, natural flavour.',
    allergens: ['milk', 'soy'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-sample-foods']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-b08', productId: 'prod-b08', version: 1, isCurrent: true, servingSizeG: 60,
    nutrients: { energy_kcal: 517.5, protein_g: 8.5, carbohydrate_g: 46, sugar_g: 23, total_fat_g: 17.25, sat_fat_g: 9.2, fibre_g: 1.7, sodium_mg: 575 },
    ingredientsText: 'Peanuts, peanut butter, protein blend (whey, milk).',
    allergens: ['peanut', 'milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-northline-wellness']!,
    vegMark: 'veg', processingLevel: 1, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-b09', productId: 'prod-b09', version: 1, isCurrent: true, servingSizeG: 60,
    nutrients: { energy_kcal: 472.5, protein_g: 9.5, carbohydrate_g: 42, sugar_g: 21, total_fat_g: 15.75, sat_fat_g: 8.4, fibre_g: 1.9, sodium_mg: 525 },
    ingredientsText: 'Rolled oats, honey, protein blend (whey, milk), sucralose, MSG (flavour enhancer).',
    allergens: ['milk'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-purecycle-foods']!,
    vegMark: 'veg', processingLevel: 4, capturedAt: CAPTURED_AT, photoPaths: [],
  },
  {
    id: 'lv-b10', productId: 'prod-b10', version: 1, isCurrent: true, servingSizeG: 55,
    nutrients: { energy_kcal: 517.5, protein_g: 8.5, carbohydrate_g: 46, sugar_g: 23, total_fat_g: 17.25, sat_fat_g: 9.2, fibre_g: 1.7, sodium_mg: 575 },
    ingredientsText: 'Protein blend (whey, soy), mint, dark chocolate, caramel colour (class IV).',
    allergens: ['milk', 'soy'], claims: ['High protein'], fssaiLicenseNo: FSSAI_LICENSE['brand-anchorpoint-nutrition']!,
    vegMark: 'veg', processingLevel: 2, capturedAt: CAPTURED_AT, photoPaths: [],
  },
];

export const LABEL_VERSION_ADDITIVES: LabelVersionAdditiveLink[] = [
  { labelVersionId: 'lv-w04', additiveId: 'add-lecithin' },
  { labelVersionId: 'lv-w05', additiveId: 'add-bha' },
  { labelVersionId: 'lv-w05', additiveId: 'add-caramel-color' },
  { labelVersionId: 'lv-w10', additiveId: 'add-lecithin' },
  { labelVersionId: 'lv-w10', additiveId: 'add-msg' },

  { labelVersionId: 'lv-b01', additiveId: 'add-caramel-color' },
  { labelVersionId: 'lv-b01', additiveId: 'add-msg' },
  { labelVersionId: 'lv-b02', additiveId: 'add-tartrazine' },
  { labelVersionId: 'lv-b02', additiveId: 'add-caramel-color' },
  { labelVersionId: 'lv-b03', additiveId: 'add-sodium-benzoate' },
  { labelVersionId: 'lv-b06', additiveId: 'add-caramel-color' },
  { labelVersionId: 'lv-b06', additiveId: 'add-cellulose-gum' },
  { labelVersionId: 'lv-b09', additiveId: 'add-sucralose' },
  { labelVersionId: 'lv-b09', additiveId: 'add-msg' },
  { labelVersionId: 'lv-b10', additiveId: 'add-caramel-color' },
];
