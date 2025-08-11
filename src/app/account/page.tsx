'use client';
import React from 'react';
import Header from '@/components/header';
import AuthGuard from '@/components/auth-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function AccountPage() {
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
                You haven't saved any calculators yet. Generate one to get started!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12">
                <p>No calculators found.</p>
                <Button variant="link" className="mt-2">
                  Create a calculator
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
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
