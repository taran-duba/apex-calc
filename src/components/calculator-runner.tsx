'use client';
import React, { useState, useEffect, useMemo } from 'react';
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

  const calculateResult = useMemo(() => {
    if (!definition) return () => null;

    const inputNames = definition.inputs.map((i) => i.name);
    try {
      const formulaFunc = new Function(
        ...inputNames,
        `try { ${definition.formula} } catch(e) { console.error('Calculation error:', e); return null; }`
      );
      return formulaFunc;
    } catch(e) {
      console.error('Failed to create formula function:', e);
      setError('The AI generated an invalid calculation formula.');
      return () => null;
    }
  }, [definition]);
  
  useEffect(() => {
    if (definition && Object.keys(inputValues).length > 0) {
      const args = definition.inputs.map(input => parseFloat(inputValues[input.name]) || 0);
      const newResult = calculateResult(...args);
      
      setResult(newResult);
      if (newResult !== null) {
        setIsNewResult(true);
        const timer = setTimeout(() => setIsNewResult(false), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [inputValues, definition, calculateResult]);

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
            {result !== null ? result : '...'}
            {definition.output.suffix}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
