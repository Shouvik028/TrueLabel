import { z } from 'zod';

/** ARCHITECTURE.md §5 `test_results` — one row per (batch, parameter). */
export const testResultRowSchema = z.object({
  batchId: z.string().min(1),
  parameterCode: z.string().min(1),
  value: z.number().nonnegative().finite(),
  unit: z.string().min(1),
  method: z.string().nullable(),
  belowDetection: z.boolean(),
});

export const testResultsSchema = z.array(testResultRowSchema);

export type TestResultRow = z.infer<typeof testResultRowSchema>;
