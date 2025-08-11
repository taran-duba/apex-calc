
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
    .describe('A JSON string that conforms to the CalculatorDefinition interface.'),
});
export type GenerateCalculatorOutput = z.infer<typeof GenerateCalculatorOutputSchema>;

export async function generateCalculator(input: GenerateCalculatorInput): Promise<GenerateCalculatorOutput> {
  return generateCalculatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCalculatorPrompt',
  input: {schema: GenerateCalculatorInputSchema},
  output: {schema: GenerateCalculatorOutputSchema},
  prompt: `
You are an AI expert in generating calculator definitions in JSON format.

Your task is to create a JSON object that defines a calculator based on the user's description. The JSON object must strictly follow this TypeScript interface:

\`\`\`typescript
interface CalculatorInput {
  name: string; // A camelCase identifier for the input field
  label: string; // A user-friendly label for the input field
  type: 'number' | 'text';
  defaultValue?: number | string;
}

interface CalculatorOutput {
  label: string; // A user-friendly label for the result
  prefix?: string; // e.g., '$'
  suffix?: string; // e.g., 'kg'
}

interface CalculatorDefinition {
  title: string; // A concise title for the calculator
  description: string; // A brief description of what the calculator does
  inputs: CalculatorInput[]; // An array of input field definitions
  formula: string; // A single line of JavaScript code to calculate the result. The 'return' keyword is implicit. The formula will have access to variables named after the 'name' property of each input.
  output: CalculatorOutput; // The definition for the output display
}
\`\`\`

The 'formula' must be a valid, single-line JavaScript expression. It should calculate the result using the 'name' of the inputs as variables. DO NOT include 'return', semicolons, or any other statements.

For example, if the user asks for a "simple interest calculator", a valid JSON output would be:
\`\`\`json
{
  "calculatorCode": "{\\"title\\":\\"Simple Interest Calculator\\",\\"description\\":\\"Calculates simple interest given principal, rate, and time.\\",\\"inputs\\":[{\\"name\\":\\"principal\\",\\"label\\":\\"Principal Amount\\",\\"type\\":\\"number\\",\\"defaultValue\\":1000},{\\"name\\":\\"rate\\",\\"label\\":\\"Annual Interest Rate (%)\\",\\"type\\":\\"number\\",\\"defaultValue\\":5},{\\"name\\":\\"time\\",\\"label\\":\\"Time (Years)\\",\\"type\\":\\"number\\",\\"defaultValue\\":1} ],\\"formula\\":\\"principal * (rate / 100) * time\\",\\"output\\":{\\"label\\":\\"Total Interest\\",\\"prefix\\":\\"$\\"}}"
}
\`\`\`

Another example for a "BMI Calculator":
\`\`\`json
{
  "calculatorCode": "{\\"title\\":\\"BMI Calculator\\",\\"description\\":\\"Calculate Body Mass Index (BMI).\\",\\"inputs\\":[{\\"name\\":\\"weightKg\\",\\"label\\":\\"Weight (kg)\\",\\"type\\":\\"number\\",\\"defaultValue\\":70},{\\"name\\":\\"heightCm\\",\\"label\\":\\"Height (cm)\\",\\"type\\":\\"number\\",\\"defaultValue\\":175}],\\"formula\\":\\"weightKg / ((heightCm / 100) ** 2)\\",\\"output\\":{\\"label\\":\\"Your BMI\\"}}"
}
\`\`\`

Now, based on the description provided, generate the JSON object for the calculator.

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
