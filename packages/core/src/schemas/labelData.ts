import { z } from 'zod';

/**
 * Per-100g declared nutrients (label_versions.nutrients jsonb). Every field is
 * optional — a label may omit some, and computeLabelAccuracy handles absence.
 */
const nutrientValueSchema = z.number().nonnegative().finite();

export const labelNutrientsSchema = z.object({
  energy_kcal: nutrientValueSchema.optional(),
  protein_g: nutrientValueSchema.optional(),
  carbohydrate_g: nutrientValueSchema.optional(),
  sugar_g: nutrientValueSchema.optional(),
  total_fat_g: nutrientValueSchema.optional(),
  sat_fat_g: nutrientValueSchema.optional(),
  fibre_g: nutrientValueSchema.optional(),
  sodium_mg: nutrientValueSchema.optional(),
});

export const vegMarkSchema = z.enum(['veg', 'non_veg', 'none']);

/** NOVA-style 1–4 (ARCHITECTURE.md §5 `label_versions.processing_level`). */
export const processingLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

/** ARCHITECTURE.md §5 `label_versions`. */
export const labelDataSchema = z.object({
  servingSizeG: z.number().positive().finite().nullable(),
  nutrients: labelNutrientsSchema,
  ingredientsText: z.string().nullable(),
  allergens: z.array(z.string().min(1)),
  claims: z.array(z.string()),
  fssaiLicenseNo: z.string().nullable(),
  vegMark: vegMarkSchema,
  processingLevel: processingLevelSchema,
  capturedAt: z.string().min(1),
  photoPaths: z.array(z.string()),
});

export type LabelData = z.infer<typeof labelDataSchema>;
