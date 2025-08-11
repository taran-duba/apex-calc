'use server';

import { generateCalculator } from '@/ai/flows/calculator-generation';

export async function generateCalculatorAction(description: string) {
  try {
    if (!description) {
      throw new Error('Description cannot be empty.');
    }
    const result = await generateCalculator({ description });
    return { success: true, data: result.calculatorCode };
  } catch (error) {
    console.error('Error generating calculator:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}
