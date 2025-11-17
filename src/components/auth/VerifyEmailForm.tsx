'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const formSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    if (!email) {
      setError('Email not provided. Please register again.');
    }
  }, [email]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Email not provided.');
      setIsSubmitting(false);
      return;
    }

    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: values.otp }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (response.ok) {
      setSuccess(data.message);
      form.reset();
      router.push('/login'); // Redirect to login after successful verification
    } else {
      setError(data.message || 'An error occurred during OTP verification.');
    }
  }

  const handleResendOtp = async () => {
    setResendMessage(null);
    if (!email) {
      setError('Email not provided to resend OTP.');
      return;
    }

    const response = await fetch('/api/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setResendMessage(data.message);
    } else {
      setError(data.message || 'Failed to resend OTP.');
    }
  };

  if (!email && !error) {
    return (
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Email</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Your Email</CardTitle>
        <CardDescription>
          A 6-digit code has been sent to <strong>{email}</strong>. Please enter it below to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {resendMessage && (
          <Alert className="mb-4 bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Resend OTP</AlertTitle>
            <AlertDescription>{resendMessage}</AlertDescription>
          </Alert>
        )}
        {!success && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="XXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>
          </Form>
        )}
        <div className="mt-4 text-center text-sm">
          Didn't receive the code?{' '}
          <Button variant="link" onClick={handleResendOtp} disabled={isSubmitting}>
            Resend OTP
          </Button>
        </div>
        <div className="mt-2 text-center text-sm">
          <Link href="/login" className="underline text-primary">
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
