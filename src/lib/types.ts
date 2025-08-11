export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'text';
  defaultValue?: number | string;
}

export interface CalculatorOutput {
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface CalculatorDefinition {
  title: string;
  description: string;
  inputs: CalculatorInput[];
  formula: string;
  output: CalculatorOutput;
}
