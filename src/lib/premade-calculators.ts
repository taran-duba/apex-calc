import React from 'react';
import type { CalculatorDefinition } from '@/lib/types';
import { Gauge, Landmark, UtensilsCrossed } from 'lucide-react';

export const premadeCalculators: (CalculatorDefinition & { icon: React.ReactNode })[] = [
  {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index.',
    icon: React.createElement(Gauge),
    inputs: [
      { name: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70 },
      { name: 'height', label: 'Height (cm)', type: 'number', defaultValue: 175 },
    ],
    formula: "weight / ((height / 100) ** 2)",
    output: { label: 'Your BMI' },
  },
  {
    title: 'Tip Calculator',
    description: 'Calculate the tip for a bill.',
    icon: React.createElement(UtensilsCrossed),
    inputs: [
      { name: 'bill', label: 'Bill Amount', type: 'number', defaultValue: 50 },
      { name: 'tipPercentage', label: 'Tip Percentage', type: 'number', defaultValue: 18 },
      { name: 'people', label: 'Number of People', type: 'number', defaultValue: 1 },
    ],
    formula: "(bill * (1 + tipPercentage / 100)) / people",
    output: { label: 'Amount Per Person', prefix: '$' },
  },
  {
    title: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payments.',
    icon: React.createElement(Landmark),
    inputs: [
      { name: 'principal', label: 'Loan Amount', type: 'number', defaultValue: 300000 },
      { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 5.5 },
      { name: 'years', label: 'Loan Term (Years)', type: 'number', defaultValue: 30 },
    ],
    formula: "(principal * (rate / 100 / 12) * Math.pow(1 + (rate / 100 / 12), years * 12)) / (Math.pow(1 + (rate / 100 / 12), years * 12) - 1)",
    output: { label: 'Monthly Payment', prefix: '$' },
  },
];
