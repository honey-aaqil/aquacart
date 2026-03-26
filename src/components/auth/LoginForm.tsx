'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal, Waves } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailVerified = searchParams.get('verified') === 'true';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'Invalid email or password.' : result.error);
      } else if (result?.ok) {
        // Redirect to Home as requested
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
        setError('An unexpected error occurred.');
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    // Main Container
   
    <div id="01" className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark font-display">
      
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Waves className="w-12 h-12 text-primary-dark" />
          <h1 className="text-3xl font-bold text-primary-dark">Welcome to AquaFresh</h1>
          <h3 className="text-secondary-teal dark:text-gray-400">Sign in to continue</h3>
        </div>

        {/* Alerts */}
        {emailVerified && (
            <Alert className="bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                    Your email has been verified. You can now log in.
                </AlertDescription>
            </Alert>
        )}
        {error && (
            <Alert variant="destructive" className="bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 space-y-0">
                  <FormLabel className="text-sm font-medium text-primary-dark/80 dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      className="h-12 w-full rounded-lg border-secondary-teal/30 bg-card-light dark:bg-card-dark dark:border-gray-700 shadow-sm focus:border-primary-medium focus:ring-primary-medium text-primary-dark dark:text-gray-200" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 space-y-0">
                  <FormLabel className="text-sm font-medium text-primary-dark/80 dark:text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="h-12 w-full rounded-lg border-secondary-teal/30 bg-card-light dark:bg-card-dark dark:border-gray-700 shadow-sm focus:border-primary-medium focus:ring-primary-medium text-primary-dark dark:text-gray-200" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 flex flex-col gap-3">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center rounded-full bg-primary-medium hover:bg-primary-medium/90 text-base font-bold text-white shadow-md transition-transform active:scale-95"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              
              <Button 
                type="button"
                onClick={() => router.push('/register')}
                className="flex h-12 w-full items-center justify-center rounded-full bg-accent hover:bg-accent/90 text-base font-bold text-white shadow-md transition-transform active:scale-95"
              >
                Sign Up
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}