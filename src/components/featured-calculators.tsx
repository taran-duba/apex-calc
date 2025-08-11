'use client';
import React, { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CalculatorRunner from './calculator-runner';
import { premadeCalculators } from '@/lib/premade-calculators';
import type { CalculatorDefinition } from '@/lib/types';

export default function FeaturedCalculators() {
  const [selectedCalc, setSelectedCalc] = useState<CalculatorDefinition | null>(null);

  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8 font-headline">Featured Calculators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premadeCalculators.map((calc) => (
          <Card
            key={calc.title}
            onClick={() => setSelectedCalc(calc)}
            className="cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                  {React.cloneElement(calc.icon as React.ReactElement, { className: 'h-6 w-6' })}
                </div>
                <div>
                  <CardTitle className="font-headline">{calc.title}</CardTitle>
                  <CardDescription>{calc.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedCalc} onOpenChange={(isOpen) => !isOpen && setSelectedCalc(null)}>
        <DialogContent className="sm:max-w-[625px] bg-card border-primary/50">
           {selectedCalc && (
            <>
                <DialogHeader>
                    <DialogTitle className="sr-only">{selectedCalc.title}</DialogTitle>
                    <DialogDescription className="sr-only">{selectedCalc.description}</DialogDescription>
                </DialogHeader>
                <CalculatorRunner definitionString={JSON.stringify(selectedCalc)} />
            </>
           )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
