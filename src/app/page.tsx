'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import CalculatorGenerator from '@/components/calculator-generator';
import CalculatorRunner from '@/components/calculator-runner';
import FeaturedCalculators from '@/components/featured-calculators';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [generatedCalc, setGeneratedCalc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = (definition: string) => {
    setGeneratedCalc(definition);
    setIsGenerating(false);
  };

  const handleGenerating = () => {
    setIsGenerating(true);
    setGeneratedCalc(null);
  };

  return (
    <div className="flex flex-col w-full">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-12 md:gap-16">
          <section className="text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4 text-primary">
              ApexCalc
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-8">
              Describe any calculator in plain English. Our AI engine will build it for you in seconds.
              From complex financial models to simple unit conversions, get your calculations done at F1 speed.
            </p>
            <CalculatorGenerator onGenerate={handleGenerate} onGenerating={handleGenerating} />
          </section>

          {(isGenerating || generatedCalc) && (
            <section id="generated-calculator" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-center mb-6 font-headline">Your Generated Calculator</h2>
              <div className="max-w-2xl mx-auto">
                {isGenerating ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <div className="border-t pt-4 mt-4">
                          <Skeleton className="h-12 w-1/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  generatedCalc && <CalculatorRunner definitionString={generatedCalc} />
                )}
              </div>
            </section>
          )}

          <FeaturedCalculators />
        </div>
      </main>
      <footer className="text-center py-6 border-t">
        <p className="text-sm text-muted-foreground">Built with F1 Speed. Powered by AI.</p>
      </footer>
    </div>
  );
}
