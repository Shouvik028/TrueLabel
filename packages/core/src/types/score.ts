import type { AccuracyBand, Grade, SafetyStatus } from './enums';
import type { SafetyResult } from '../scoring/safety';
import type { LabelAccuracyResult } from '../scoring/labelAccuracy';
import type { FoodGradeResult } from '../scoring/foodGrade';

export interface ProductScoreBreakdown {
  methodologyVersion: string;
  safety: SafetyResult;
  labelAccuracy: LabelAccuracyResult;
  foodGrade: FoodGradeResult;
}

export interface Score {
  id: string;
  productId: string;
  batchId: string;
  labelAccuracy: number | null;
  accuracyBand: AccuracyBand;
  grade: Grade;
  gradeComposite: number;
  safety: SafetyStatus;
  breakdown: ProductScoreBreakdown;
  methodologyVersion: string;
  publishedAt: string;
  approvedBy: string;
  supersedesId: string | null;
  correctionReason: string | null;
}
