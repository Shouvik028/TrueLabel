import type { NutrientCode } from '@truelabel/core';

export interface BatchContaminant {
  parameterCode: 'lead_mg_kg' | 'cadmium_mg_kg' | 'arsenic_mg_kg';
  value: number;
  belowDetection: boolean;
}

export interface TestBatchSource {
  id: string;
  productId: string;
  labId: string;
  labelVersionId: string;
  cycleNumber: number;
  purchaseDate: string;
  purchaseStore: string;
  lotNumber: string;
  expiryDate: string;
  status: 'published';
  enteredBy: string;
  reviewedBy: string;
  reviewNotes: string | null;
  /** Lab-measured, per 100g. */
  nutrients: Partial<Record<NutrientCode, number>>;
  contaminants: BatchContaminant[];
  /** Allergen codes (e.g. allergen_peanut) detected in this batch. */
  allergenDetections: string[];
}

const NORTHSTAR = 'lab-northstar';
const CLEARPATH = 'lab-clearpath';

const ANALYST_1 = 'staff-analyst-01';
const ANALYST_2 = 'staff-analyst-02';
const ADMIN_1 = 'staff-admin-01';
const ADMIN_2 = 'staff-admin-02';

/** Standard heavy-metal panel; ratios computed at build time against testParameters limits. */
function contaminants(lead: number, cadmium = 0.075, arsenic = 0.044): BatchContaminant[] {
  return [
    { parameterCode: 'lead_mg_kg', value: lead, belowDetection: false },
    { parameterCode: 'cadmium_mg_kg', value: cadmium, belowDetection: false },
    { parameterCode: 'arsenic_mg_kg', value: arsenic, belowDetection: false },
  ];
}

export const TEST_BATCHES: TestBatchSource[] = [
  // --- Whey protein ---------------------------------------------------
  {
    id: 'batch-w01-c1', productId: 'prod-w01', labId: NORTHSTAR, labelVersionId: 'lv-w01', cycleNumber: 1,
    purchaseDate: '2026-08-10', purchaseStore: 'GreenMart Retail', lotNumber: 'LOT-2026-1001', expiryDate: '2027-08-10',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 390.5, protein_g: 72, carbohydrate_g: 8, sugar_g: 4.35, total_fat_g: 7, sat_fat_g: 2.025, fibre_g: 2.55, sodium_mg: 195 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w02-c1', productId: 'prod-w02', labId: NORTHSTAR, labelVersionId: 'lv-w02', cycleNumber: 1,
    purchaseDate: '2026-03-15', purchaseStore: 'CityBasket Online', lotNumber: 'LOT-2026-1002', expiryDate: '2027-03-15',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 432.5, protein_g: 60, carbohydrate_g: 8, sugar_g: 9.75, total_fat_g: 7, sat_fat_g: 4.125, fibre_g: 0.75, sodium_mg: 375 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w02-c2', productId: 'prod-w02', labId: NORTHSTAR, labelVersionId: 'lv-w02', cycleNumber: 2,
    purchaseDate: '2026-08-20', purchaseStore: 'CityBasket Online', lotNumber: 'LOT-2026-1003', expiryDate: '2027-08-20',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 425.5, protein_g: 62, carbohydrate_g: 8, sugar_g: 8.85, total_fat_g: 7, sat_fat_g: 3.775, fibre_g: 1.05, sodium_mg: 345 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w03-c1', productId: 'prod-w03', labId: CLEARPATH, labelVersionId: 'lv-w03', cycleNumber: 1,
    purchaseDate: '2026-07-05', purchaseStore: 'FreshCart Supermarket', lotNumber: 'LOT-2026-1004', expiryDate: '2027-07-05',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 450, protein_g: 55, carbohydrate_g: 8, sugar_g: 12, total_fat_g: 7, sat_fat_g: 5, fibre_g: 0, sodium_mg: 450 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w04-c1', productId: 'prod-w04', labId: NORTHSTAR, labelVersionId: 'lv-w04', cycleNumber: 1,
    purchaseDate: '2026-04-01', purchaseStore: 'QuickBuy Grocery', lotNumber: 'LOT-2026-1005', expiryDate: '2027-04-01',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 450, protein_g: 55, carbohydrate_g: 8, sugar_g: 12, total_fat_g: 7, sat_fat_g: 5, fibre_g: 0, sodium_mg: 450 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w05-c1', productId: 'prod-w05', labId: NORTHSTAR, labelVersionId: 'lv-w05', cycleNumber: 1,
    purchaseDate: '2026-01-10', purchaseStore: 'MetroFresh Stores', lotNumber: 'LOT-2026-1006', expiryDate: '2027-01-10',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 439.5, protein_g: 58, carbohydrate_g: 8, sugar_g: 10.65, total_fat_g: 7, sat_fat_g: 4.475, fibre_g: 0.45, sodium_mg: 405 },
    contaminants: contaminants(0.375), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w05-c2', productId: 'prod-w05', labId: NORTHSTAR, labelVersionId: 'lv-w05', cycleNumber: 2,
    purchaseDate: '2026-04-12', purchaseStore: 'MetroFresh Stores', lotNumber: 'LOT-2026-1007', expiryDate: '2027-04-12',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 446.5, protein_g: 56, carbohydrate_g: 8, sugar_g: 11.55, total_fat_g: 7, sat_fat_g: 4.825, fibre_g: 0.15, sodium_mg: 435 },
    contaminants: contaminants(0.5), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w05-c3', productId: 'prod-w05', labId: NORTHSTAR, labelVersionId: 'lv-w05', cycleNumber: 3,
    purchaseDate: '2026-08-15', purchaseStore: 'MetroFresh Stores', lotNumber: 'LOT-2026-1008', expiryDate: '2027-08-15',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_1,
    reviewNotes: 'Contaminant levels trending up across cycles — flagged for a shorter retest interval.',
    nutrients: { energy_kcal: 450, protein_g: 55, carbohydrate_g: 8, sugar_g: 12, total_fat_g: 7, sat_fat_g: 5, fibre_g: 0, sodium_mg: 450 },
    contaminants: contaminants(0.75), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w06-c1', productId: 'prod-w06', labId: CLEARPATH, labelVersionId: 'lv-w06', cycleNumber: 1,
    purchaseDate: '2026-09-05', purchaseStore: 'GreenMart Retail', lotNumber: 'LOT-2026-1009', expiryDate: '2027-09-05',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_2,
    reviewNotes: 'Lead result confirmed on retest — exceeds the FSSAI limit. Escalated as Unsafe.',
    nutrients: { energy_kcal: 415, protein_g: 65, carbohydrate_g: 8, sugar_g: 7.5, total_fat_g: 7, sat_fat_g: 3.25, fibre_g: 1.5, sodium_mg: 300 },
    contaminants: contaminants(3.25), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w07-c1', productId: 'prod-w07', labId: NORTHSTAR, labelVersionId: 'lv-w07', cycleNumber: 1,
    purchaseDate: '2026-02-20', purchaseStore: 'CityBasket Online', lotNumber: 'LOT-2026-1010', expiryDate: '2027-02-20',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 404.5, protein_g: 68, carbohydrate_g: 8, sugar_g: 6.15, total_fat_g: 7, sat_fat_g: 2.725, fibre_g: 1.95, sodium_mg: 255 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w07-c2', productId: 'prod-w07', labId: NORTHSTAR, labelVersionId: 'lv-w07', cycleNumber: 2,
    purchaseDate: '2026-08-25', purchaseStore: 'CityBasket Online', lotNumber: 'LOT-2026-1011', expiryDate: '2027-08-25',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 397.5, protein_g: 70, carbohydrate_g: 8, sugar_g: 5.25, total_fat_g: 7, sat_fat_g: 2.375, fibre_g: 2.25, sodium_mg: 225 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w08-c1', productId: 'prod-w08', labId: CLEARPATH, labelVersionId: 'lv-w08', cycleNumber: 1,
    purchaseDate: '2026-08-01', purchaseStore: 'FreshCart Supermarket', lotNumber: 'LOT-2026-1012', expiryDate: '2027-08-01',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 418.5, protein_g: 64, carbohydrate_g: 8, sugar_g: 7.95, total_fat_g: 7, sat_fat_g: 3.425, fibre_g: 1.35, sodium_mg: 315 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w09-c1', productId: 'prod-w09', labId: NORTHSTAR, labelVersionId: 'lv-w09', cycleNumber: 1,
    purchaseDate: '2026-07-20', purchaseStore: 'QuickBuy Grocery', lotNumber: 'LOT-2026-1013', expiryDate: '2027-07-20',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 446.5, protein_g: 56, carbohydrate_g: 8, sugar_g: 11.55, total_fat_g: 7, sat_fat_g: 4.825, fibre_g: 0.15, sodium_mg: 435 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w10-c1', productId: 'prod-w10', labId: NORTHSTAR, labelVersionId: 'lv-w10', cycleNumber: 1,
    purchaseDate: '2026-03-01', purchaseStore: 'MetroFresh Stores', lotNumber: 'LOT-2026-1014', expiryDate: '2027-03-01',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 443, protein_g: 57, carbohydrate_g: 8, sugar_g: 11.1, total_fat_g: 7, sat_fat_g: 4.65, fibre_g: 0.3, sodium_mg: 420 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-w10-c2', productId: 'prod-w10', labId: NORTHSTAR, labelVersionId: 'lv-w10', cycleNumber: 2,
    purchaseDate: '2026-08-05', purchaseStore: 'MetroFresh Stores', lotNumber: 'LOT-2026-1015', expiryDate: '2027-08-05',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_2,
    reviewNotes: 'Measured protein is well below the declared label value — flagged for label review.',
    nutrients: { energy_kcal: 450, protein_g: 55, carbohydrate_g: 8, sugar_g: 12, total_fat_g: 7, sat_fat_g: 5, fibre_g: 0, sodium_mg: 450 },
    contaminants: contaminants(0.125), allergenDetections: ['milk'],
  },

  // --- Protein bars ----------------------------------------------------
  {
    id: 'batch-b01-c1', productId: 'prod-b01', labId: NORTHSTAR, labelVersionId: 'lv-b01', cycleNumber: 1,
    purchaseDate: '2026-08-12', purchaseStore: 'GreenMart Retail', lotNumber: 'LOT-2026-2001', expiryDate: '2027-02-12',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 450, protein_g: 10, carbohydrate_g: 40, sugar_g: 20, total_fat_g: 15, sat_fat_g: 8, fibre_g: 2, sodium_mg: 500 },
    contaminants: contaminants(1.0), allergenDetections: ['peanut', 'milk'],
  },
  {
    id: 'batch-b02-c1', productId: 'prod-b02', labId: CLEARPATH, labelVersionId: 'lv-b02', cycleNumber: 1,
    purchaseDate: '2026-07-28', purchaseStore: 'CityBasket Online', lotNumber: 'LOT-2026-2002', expiryDate: '2027-01-28',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 450, protein_g: 10, carbohydrate_g: 40, sugar_g: 20, total_fat_g: 15, sat_fat_g: 8, fibre_g: 2, sodium_mg: 500 },
    contaminants: contaminants(2.0), allergenDetections: ['milk', 'soy'],
  },
  {
    id: 'batch-b03-c1', productId: 'prod-b03', labId: NORTHSTAR, labelVersionId: 'lv-b03', cycleNumber: 1,
    purchaseDate: '2026-03-10', purchaseStore: 'FreshCart Supermarket', lotNumber: 'LOT-2026-2003', expiryDate: '2026-09-10',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 445, protein_g: 10.75, carbohydrate_g: 40, sugar_g: 19.25, total_fat_g: 15, sat_fat_g: 7.7, fibre_g: 2.3, sodium_mg: 482.5 },
    contaminants: contaminants(0.125), allergenDetections: ['milk', 'tree_nut'],
  },
  {
    id: 'batch-b03-c2', productId: 'prod-b03', labId: NORTHSTAR, labelVersionId: 'lv-b03', cycleNumber: 2,
    purchaseDate: '2026-08-18', purchaseStore: 'FreshCart Supermarket', lotNumber: 'LOT-2026-2004', expiryDate: '2027-02-18',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 440, protein_g: 11.5, carbohydrate_g: 40, sugar_g: 18.5, total_fat_g: 15, sat_fat_g: 7.4, fibre_g: 2.6, sodium_mg: 465 },
    contaminants: contaminants(0.125), allergenDetections: ['milk', 'tree_nut'],
  },
  {
    id: 'batch-b04-c1', productId: 'prod-b04', labId: CLEARPATH, labelVersionId: 'lv-b04', cycleNumber: 1,
    purchaseDate: '2026-08-22', purchaseStore: 'QuickBuy Grocery', lotNumber: 'LOT-2026-2005', expiryDate: '2027-02-22',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_2,
    reviewNotes: 'Trace peanut detected but not declared on the label — flagged to compliance for a label correction.',
    nutrients: { energy_kcal: 410, protein_g: 16, carbohydrate_g: 40, sugar_g: 14, total_fat_g: 15, sat_fat_g: 5.6, fibre_g: 4.4, sodium_mg: 360 },
    contaminants: contaminants(0.125), allergenDetections: ['milk', 'soy', 'peanut'],
  },
  {
    id: 'batch-b05-c1', productId: 'prod-b05', labId: NORTHSTAR, labelVersionId: 'lv-b05', cycleNumber: 1,
    purchaseDate: '2026-09-01', purchaseStore: 'MetroFresh Stores', lotNumber: 'LOT-2026-2006', expiryDate: '2027-03-01',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 360, protein_g: 23.5, carbohydrate_g: 40, sugar_g: 6.5, total_fat_g: 15, sat_fat_g: 2.6, fibre_g: 7.4, sodium_mg: 185 },
    contaminants: contaminants(0.125), allergenDetections: ['milk', 'soy'],
  },
  {
    id: 'batch-b06-c1', productId: 'prod-b06', labId: NORTHSTAR, labelVersionId: 'lv-b06', cycleNumber: 1,
    purchaseDate: '2026-07-15', purchaseStore: 'GreenMart Retail', lotNumber: 'LOT-2026-2007', expiryDate: '2027-01-15',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 450, protein_g: 10, carbohydrate_g: 40, sugar_g: 20, total_fat_g: 15, sat_fat_g: 8, fibre_g: 2, sodium_mg: 500 },
    contaminants: contaminants(0.375), allergenDetections: ['milk'],
  },
  {
    id: 'batch-b07-c1', productId: 'prod-b07', labId: CLEARPATH, labelVersionId: 'lv-b07', cycleNumber: 1,
    purchaseDate: '2026-08-05', purchaseStore: 'CityBasket Online', lotNumber: 'LOT-2026-2008', expiryDate: '2027-02-05',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 400, protein_g: 17.5, carbohydrate_g: 40, sugar_g: 12.5, total_fat_g: 15, sat_fat_g: 5, fibre_g: 5, sodium_mg: 325 },
    contaminants: contaminants(0.125), allergenDetections: ['milk', 'soy'],
  },
  {
    id: 'batch-b08-c1', productId: 'prod-b08', labId: NORTHSTAR, labelVersionId: 'lv-b08', cycleNumber: 1,
    purchaseDate: '2026-08-28', purchaseStore: 'FreshCart Supermarket', lotNumber: 'LOT-2026-2009', expiryDate: '2027-02-28',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 450, protein_g: 10, carbohydrate_g: 40, sugar_g: 20, total_fat_g: 15, sat_fat_g: 8, fibre_g: 2, sodium_mg: 500 },
    contaminants: contaminants(0.125), allergenDetections: ['peanut', 'milk'],
  },
  {
    id: 'batch-b09-c1', productId: 'prod-b09', labId: NORTHSTAR, labelVersionId: 'lv-b09', cycleNumber: 1,
    purchaseDate: '2026-07-10', purchaseStore: 'QuickBuy Grocery', lotNumber: 'LOT-2026-2010', expiryDate: '2027-01-10',
    status: 'published', enteredBy: ANALYST_1, reviewedBy: ADMIN_1, reviewNotes: null,
    nutrients: { energy_kcal: 450, protein_g: 10, carbohydrate_g: 40, sugar_g: 20, total_fat_g: 15, sat_fat_g: 8, fibre_g: 2, sodium_mg: 500 },
    contaminants: contaminants(1.125), allergenDetections: ['milk'],
  },
  {
    id: 'batch-b10-c1', productId: 'prod-b10', labId: CLEARPATH, labelVersionId: 'lv-b10', cycleNumber: 1,
    purchaseDate: '2026-08-15', purchaseStore: 'MetroFresh Stores', lotNumber: 'LOT-2026-2011', expiryDate: '2027-02-15',
    status: 'published', enteredBy: ANALYST_2, reviewedBy: ADMIN_2, reviewNotes: null,
    nutrients: { energy_kcal: 450, protein_g: 10, carbohydrate_g: 40, sugar_g: 20, total_fat_g: 15, sat_fat_g: 8, fibre_g: 2, sodium_mg: 500 },
    contaminants: contaminants(0.25), allergenDetections: ['milk', 'soy'],
  },
];
