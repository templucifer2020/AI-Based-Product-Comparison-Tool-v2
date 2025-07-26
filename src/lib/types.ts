import type { AnalyzeProductImageOutput } from '@/ai/flows/analyze-product-image';
import type { Timestamp } from 'firebase/firestore';

export type Ingredient = AnalyzeProductImageOutput['ingredientAnalysis'][0];

export type Product = AnalyzeProductImageOutput & {
  id: string;
  image: string;
  createdAt: Timestamp | Date;
};

export type SafetyRating = 'Safe' | 'Caution' | 'Warning';
