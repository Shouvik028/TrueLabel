import type { Product } from '@truelabel/core';

import { buildEan13 } from '../../lib/ean13';

/** Fictional GS1-India-style EAN-13s (890 prefix), check digit computed — never hand-typed. */
function barcodeFor(sequence: number): string {
  const base12 = `890${String(100000000 + sequence)}`;
  return buildEan13(base12);
}

export interface ProductBarcode {
  barcode: string;
  productId: string;
}

const WHEY = 'cat-whey-protein';
const BARS = 'cat-protein-bars';

const DEMO = 'brand-demo-nutrition';
const SAMPLE = 'brand-sample-foods';
const NORTHLINE = 'brand-northline-wellness';
const PURECYCLE = 'brand-purecycle-foods';
const ANCHORPOINT = 'brand-anchorpoint-nutrition';

export const PRODUCTS: Product[] = [
  { id: 'prod-w01', brandId: DEMO, categoryId: WHEY, name: 'Whey Isolate Chocolate', variant: '1 kg', packSize: '1 kg', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-w02', brandId: SAMPLE, categoryId: WHEY, name: 'Whey Concentrate Vanilla', variant: '1 kg', packSize: '1 kg', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-w03', brandId: NORTHLINE, categoryId: WHEY, name: 'Whey Blend Coffee', variant: '908 g', packSize: '908 g', imageUrls: [], testFrequencyMonths: 3, status: 'active', nextTestDue: null },
  { id: 'prod-w04', brandId: PURECYCLE, categoryId: WHEY, name: 'Whey Isolate Unflavoured', variant: '2 kg', packSize: '2 kg', imageUrls: [], testFrequencyMonths: 1, status: 'active', nextTestDue: null },
  { id: 'prod-w05', brandId: ANCHORPOINT, categoryId: WHEY, name: 'Whey Concentrate Mango', variant: '1 kg', packSize: '1 kg', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-w06', brandId: DEMO, categoryId: WHEY, name: 'Whey Isolate Cookies & Cream', variant: '1 kg', packSize: '1 kg', imageUrls: [], testFrequencyMonths: 1, status: 'active', nextTestDue: null },
  { id: 'prod-w07', brandId: SAMPLE, categoryId: WHEY, name: 'Whey Isolate Strawberry', variant: '1 kg', packSize: '1 kg', imageUrls: [], testFrequencyMonths: 3, status: 'active', nextTestDue: null },
  { id: 'prod-w08', brandId: NORTHLINE, categoryId: WHEY, name: 'Whey Concentrate Chocolate', variant: '2 kg', packSize: '2 kg', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-w09', brandId: PURECYCLE, categoryId: WHEY, name: 'Whey Blend Vanilla', variant: '1 kg', packSize: '1 kg', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-w10', brandId: ANCHORPOINT, categoryId: WHEY, name: 'Whey Concentrate Butterscotch', variant: '908 g', packSize: '908 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },

  { id: 'prod-b01', brandId: DEMO, categoryId: BARS, name: 'Peanut Protein Bar', variant: '12 pack', packSize: '12 x 60 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-b02', brandId: SAMPLE, categoryId: BARS, name: 'Chocolate Fudge Protein Bar', variant: '12 pack', packSize: '12 x 60 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-b03', brandId: NORTHLINE, categoryId: BARS, name: 'Almond Crunch Protein Bar', variant: '6 pack', packSize: '6 x 60 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-b04', brandId: PURECYCLE, categoryId: BARS, name: 'Coconut Protein Bar', variant: '12 pack', packSize: '12 x 55 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-b05', brandId: ANCHORPOINT, categoryId: BARS, name: 'Double Chocolate Protein Bar', variant: '6 pack', packSize: '6 x 60 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-b06', brandId: DEMO, categoryId: BARS, name: 'Caramel Protein Bar', variant: '12 pack', packSize: '12 x 60 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-b07', brandId: SAMPLE, categoryId: BARS, name: 'Berry Protein Bar', variant: '6 pack', packSize: '6 x 55 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-b08', brandId: NORTHLINE, categoryId: BARS, name: 'Peanut Butter Protein Bar', variant: '12 pack', packSize: '12 x 60 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-b09', brandId: PURECYCLE, categoryId: BARS, name: 'Oats & Honey Protein Bar', variant: '12 pack', packSize: '12 x 60 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
  { id: 'prod-b10', brandId: ANCHORPOINT, categoryId: BARS, name: 'Mint Chocolate Protein Bar', variant: '6 pack', packSize: '6 x 55 g', imageUrls: [], testFrequencyMonths: 2, status: 'active', nextTestDue: null },
];

export const PRODUCT_BARCODES: ProductBarcode[] = PRODUCTS.map((product, index) => ({
  barcode: barcodeFor(index + 1),
  productId: product.id,
}));
