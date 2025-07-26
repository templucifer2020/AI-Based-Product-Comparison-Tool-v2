'use server';

/**
 * @fileOverview AI flow to analyze a product image and extract key information.
 *
 * - analyzeProductImage - A function that handles the product image analysis process.
 * - AnalyzeProductImageInput - The input type for the analyzeProductImage function.
 * - AnalyzeProductImageOutput - The return type for the analyzeProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProductImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeProductImageInput = z.infer<typeof AnalyzeProductImageInputSchema>;

const AnalyzeProductImageOutputSchema = z.object({
  productDetails: z.object({
    name: z.string().describe('The name of the product.'),
    brand: z.string().describe('The brand of the product.'),
    category: z.string().describe('The category of the product.'),
  }),
  ingredientAnalysis: z.array(
    z.object({
      name: z.string().describe('The name of the ingredient.'),
      function: z.string().describe('The function of the ingredient in the product.'),
      benefits: z.string().describe('The benefits of the ingredient.'),
      sideEffects: z.string().describe('Potential side effects of the ingredient.'),
      safetyRating: z
        .enum(['Safe', 'Caution', 'Warning'])
        .describe('Safety rating of the ingredient.'),
      quantity: z.string().optional().describe('The quantity or concentration of the ingredient, if available (e.g., "10%").'),
    })
  ).describe('A list of ingredients found in the product, sorted from highest to lowest quantity.'),
  safetyAssessment: z.object({
    overallRating: z
      .enum(['Safe', 'Caution', 'Warning'])
      .describe('Overall safety rating of the product.'),
    warnings: z.string().describe('Important safety warnings for the product.'),
  }),
  userSentimentAnalysis: z.object({
    pros: z.string().describe('AI-generated pros of the product.'),
    cons: z.string().describe('AI-generated cons of the product.'),
    reviewSummary: z.string().describe('Comprehensive summary of user reviews.'),
  }),
  usageInstructions: z.string().describe('Instructions on how to properly use the product.'),
  expiryInformation: z.string().describe('Expiry date and time remaining, if available.'),
  recommendations: z
    .string()
    .describe('Recommendations on who should or should not use the product.'),
});
export type AnalyzeProductImageOutput = z.infer<typeof AnalyzeProductImageOutputSchema>;

export async function analyzeProductImage(
  input: AnalyzeProductImageInput
): Promise<AnalyzeProductImageOutput> {
  return analyzeProductImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProductImagePrompt',
  input: {schema: AnalyzeProductImageInputSchema},
  output: {schema: AnalyzeProductImageOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing product images and extracting key information.

  Analyze the product image and extract the following information:

  - Product Details: Name, brand, category
  - Ingredient Analysis: Complete breakdown with functions, benefits, side effects and quantity/concentration for each ingredient. Rate each ingredient as Safe, Caution, or Warning. IMPORTANT: Sort the ingredients from highest to lowest quantity based on the product's ingredient list.
  - Safety Assessment: Overall product safety evaluation (Safe, Caution, or Warning) and any important safety warnings.
  - User Sentiment Analysis: AI-generated pros & cons and a comprehensive analysis of user feedback.
  - Usage Instructions: How to properly use the product.
  - Expiry Information: Date and time remaining (when available).
  - Recommendations: Who should/shouldn't use the product.

  Use the following image as the primary source of information about the product:

  Product Image: {{media url=photoDataUri}}

  Return the output in JSON format.
  `,
});

const analyzeProductImageFlow = ai.defineFlow(
  {
    name: 'analyzeProductImageFlow',
    inputSchema: AnalyzeProductImageInputSchema,
    outputSchema: AnalyzeProductImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
