'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import type { CalculatorDefinition } from '@/lib/types';
import { cn } from '@/lib/utils';

type CalculatorRunnerProps = {
  definitionString: string;
};

const isCalculatorDefinition = (obj: any): obj is CalculatorDefinition => {
  return (
    obj &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    Array.isArray(obj.inputs) &&
    typeof obj.formula === 'string' &&
    typeof obj.output === 'object'
  );
};

export default function CalculatorRunner({ definitionString }: CalculatorRunnerProps) {
  const [definition, setDefinition] = useState<CalculatorDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<string | number | null>(null);
  const [isNewResult, setIsNewResult] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(definitionString);
      if (isCalculatorDefinition(parsed)) {
        setDefinition(parsed);
        const initialValues: Record<string, any> = {};
        parsed.inputs.forEach((input) => {
          initialValues[input.name] = input.defaultValue ?? '';
        });
        setInputValues(initialValues);
        setError(null);
      } else {
        throw new Error('Invalid calculator structure.');
      }
    } catch (e) {
      console.error('Failed to parse calculator definition:', e);
      setError('The AI returned an invalid format. Please try rephrasing your request.');
      setDefinition(null);
    }
  }, [definitionString]);

  const calculate = useCallback(() => {
    if (!definition) return;

    const formula = definition.formula;
    const inputNames = definition.inputs.map((i) => i.name);
    
    try {
      // Create a function with the input names as arguments.
      // The body of the function is the user-provided formula.
      // We wrap it in a `try...catch` to handle potential runtime errors in the formula.
      const formulaFunc = new Function(
        ...inputNames,
        `try { return ${formula}; } catch(e) { console.error('Calculation error:', e); return null; }`
      );
      
      // Get the current values for the inputs, parsing them as floats.
      const args = definition.inputs.map(input => {
        const value = inputValues[input.name];
        return input.type === 'number' ? parseFloat(value) : value;
      });

      // Call the function with the arguments.
      const newResult = formulaFunc(...args);
      
      setResult(newResult);
      if (newResult !== null && newResult !== result) {
        setIsNewResult(true);
        const timer = setTimeout(() => setIsNewResult(false), 500);
        // This cleanup is important for when the component unmounts or re-renders.
        return () => clearTimeout(timer);
      }

    } catch(e) {
      console.error('Failed to create or execute formula function:', e);
      setError('The AI generated an invalid calculation formula.');
    }
  }, [definition, inputValues, result]);

  useEffect(() => {
    // We run the calculation whenever the definition or inputs change.
    calculate();
  }, [definition, inputValues, calculate]);


  const handleInputChange = (name: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Generation Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!definition) {
    return null; 
  }

  const formatResult = (res: string | number | null) => {
    if (res === null || res === undefined) return '...';
    if (typeof res === 'number' && !Number.isFinite(res)) return '...';
    // Let's add commas to numbers for better readability
    if (typeof res === 'number') {
      return res.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return res;
  }

  return (
    <Card className="bg-card border-primary/20 shadow-lg shadow-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{definition.title}</CardTitle>
        <CardDescription>{definition.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {definition.inputs.map((input) => (
          <div key={input.name} className="grid w-full items-center gap-2">
            <Label htmlFor={input.name} className="text-base">
              {input.label}
            </Label>
            <Input
              id={input.name}
              type={input.type}
              value={inputValues[input.name] || ''}
              onChange={(e) => handleInputChange(input.name, e.target.value)}
              placeholder={(input.defaultValue ?? '').toString()}
              className="font-code text-lg h-12 bg-background border-2 border-input focus:border-accent focus:ring-accent/50 text-accent"
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col items-start space-y-2 bg-black/20 p-6 rounded-b-lg">
        <Label className="text-sm text-muted-foreground">{definition.output.label}</Label>
        <div className="text-4xl font-bold font-code text-accent transition-all duration-300">
          <span className={cn('transition-opacity duration-500', isNewResult && 'animate-pulse')}>
            {definition.output.prefix}
            {formatResult(result)}
            {definition.output.suffix}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
