'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import AuthGuard from '@/components/auth-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getSavedCalculatorsAction } from './actions';
import type { CalculatorDefinition } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CalculatorRunner from '@/components/calculator-runner';
import { useRouter } from 'next/navigation';

type SavedCalculator = CalculatorDefinition & { id: string };

function AccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [calculators, setCalculators] = useState<SavedCalculator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCalc, setSelectedCalc] = useState<SavedCalculator | null>(null);

  useEffect(() => {
    if (user) {
      getSavedCalculatorsAction(user.uid)
        .then((result) => {
          if (result.success && result.data) {
            setCalculators(result.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const SavedCalculatorsList = () => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )
    }

    if (calculators.length === 0) {
      return (
        <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12">
          <p>No calculators found.</p>
          <Button variant="link" className="mt-2" asChild>
            <Link href="/#generated-calculator">Create a calculator</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calculators.map((calc) => (
          <Card
            key={calc.id}
            onClick={() => setSelectedCalc(calc)}
            className="cursor-pointer hover:border-primary/80 transition-shadow"
          >
            <CardHeader>
              <CardTitle>{calc.title}</CardTitle>
              <CardDescription>{calc.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter mb-8">
            My Account
          </h1>
          <Card>
            <CardHeader>
              <CardTitle>My Saved Calculators</CardTitle>
              <CardDescription>
                Here are the calculators you've generated and saved.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <SavedCalculatorsList />
            </CardContent>
          </Card>
        </div>
      </main>
      <Dialog open={!!selectedCalc} onOpenChange={(isOpen) => !isOpen && setSelectedCalc(null)}>
        <DialogContent className="sm:max-w-[625px] bg-card border-primary/50">
           {selectedCalc && (
            <CalculatorRunner definitionString={JSON.stringify(selectedCalc)} />
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function GuardedAccountPage() {
  return (
    <AuthGuard>
      <AccountPage />
    </AuthGuard>
  );
}
