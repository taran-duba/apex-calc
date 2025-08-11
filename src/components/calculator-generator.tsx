'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateCalculatorAction } from '@/app/actions';
import { Rocket } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Please describe your calculator in at least 10 characters.',
  }),
});

type CalculatorGeneratorProps = {
  onGenerate: (definition: string) => void;
  onGenerating: () => void;
};

export default function CalculatorGenerator({ onGenerate, onGenerating }: CalculatorGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onGenerating();
    try {
      const result = await generateCalculatorAction(values.description);
      if (result.success && result.data) {
        onGenerate(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error || 'The AI failed to generate a valid calculator.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Calculator Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., a mortgage calculator with inputs for loan amount, interest rate, and term in years"
                  className="min-h-[100px] text-base bg-card border-2 border-input focus:border-primary focus:ring-primary/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 text-lg"
          size="lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-5 w-5" />
              Generate Calculator
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
