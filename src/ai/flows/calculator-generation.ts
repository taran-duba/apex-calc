'use server';

/**
 * @fileOverview A calculator generation AI agent.
 *
 * - generateCalculator - A function that handles the calculator generation process.
 * - GenerateCalculatorInput - The input type for the generateCalculator function.
 * - GenerateCalculatorOutput - The return type for the generateCalculator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCalculatorInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the calculator to generate.'),
});
export type GenerateCalculatorInput = z.infer<typeof GenerateCalculatorInputSchema>;

const GenerateCalculatorOutputSchema = z.object({
  calculatorCode: z
    .string()
    .describe('The generated calculator code in a suitable format (e.g., JavaScript, JSON).'),
});
export type GenerateCalculatorOutput = z.infer<typeof GenerateCalculatorOutputSchema>;

export async function generateCalculator(input: GenerateCalculatorInput): Promise<GenerateCalculatorOutput> {
  return generateCalculatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCalculatorPrompt',
  input: {schema: GenerateCalculatorInputSchema},
  output: {schema: GenerateCalculatorOutputSchema},
  prompt: `You are an AI expert in generating calculators based on user descriptions.

  Based on the description provided, generate the calculator code. Ensure that the generated code is functional and efficient.

  Description: {{{description}}}
  `,
});

const generateCalculatorFlow = ai.defineFlow(
  {
    name: 'generateCalculatorFlow',
    inputSchema: GenerateCalculatorInputSchema,
    outputSchema: GenerateCalculatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
