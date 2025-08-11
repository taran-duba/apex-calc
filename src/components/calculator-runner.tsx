'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Save } from 'lucide-react';
import type { CalculatorDefinition } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { saveCalculatorAction } from '@/app/account/actions';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
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

    try {
      const { inputs, formula } = definition;
      
      const scope: Record<string, any> = {};
      const args: any[] = [];
      const inputNames = inputs.map(input => input.name);
      
      inputs.forEach(input => {
        const value = inputValues[input.name];
        const parsedValue = input.type === 'number' ? parseFloat(value) : value;
        scope[input.name] = parsedValue;
        args.push(parsedValue);
      });

      // All numeric args must be valid numbers for calculation
      if (inputs.some(input => input.type === 'number' && isNaN(scope[input.name]))) {
        setResult(null);
        return;
      }

      // The body of the function is the user-provided formula.
      // We wrap it in a `try...catch` to handle potential runtime errors in the formula.
      const formulaFunc = new Function(
        ...inputNames,
        `"use strict"; try { return (${formula}); } catch(e) { console.error('Calculation error:', e); return null; }`
      );

      const newResult = formulaFunc(...args);
      
      setResult(newResult);
      if (newResult !== null && newResult !== result) {
        setIsNewResult(true);
        const timer = setTimeout(() => setIsNewResult(false), 500);
        return () => clearTimeout(timer);
      }

    } catch(e) {
      console.error('Failed to create or execute formula function:', e);
      setError('The AI generated an invalid calculation formula.');
    }
  }, [definition, inputValues, result]);


  useEffect(() => {
    if (definition) {
      calculate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, definition]);


  const handleInputChange = (name: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user || !definition) return;
    setIsSaving(true);
    try {
      const result = await saveCalculatorAction({
        userId: user.uid,
        calculator: definition,
      });

      if (result.success) {
        toast({
          title: 'Calculator Saved!',
          description: 'Your calculator has been saved to your account.',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: e.message || 'Could not save the calculator. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
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
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="font-headline text-2xl text-primary">{definition.title}</CardTitle>
            <CardDescription>{definition.description}</CardDescription>
        </div>
        {user && (
            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
            </Button>
        )}
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
