'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Terminal } from 'lucide-react';
import { ALLOWED_EMAIL_DOMAINS } from '@/lib/constants';

// Schema for the registration details form
const detailsFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email().refine(email => {
    const domain = email.split('@')[1];
    return ALLOWED_EMAIL_DOMAINS.includes(domain);
  }, { message: "Please use a Gmail, Yahoo, Outlook, or iCloud email." }),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, { message: "Enter a valid international phone number (e.g., +15551234)." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

// Schema for the OTP verification form
const otpFormSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  
  const [step, setStep] = useState<'details' | 'verify'>('details');
  const [userEmail, setUserEmail] = useState<string>('');

  // Form for user details
  const detailsForm = useForm<z.infer<typeof detailsFormSchema>>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  // Form for OTP
  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Handler for the first step (submitting details)
  async function onDetailsSubmit(values: z.infer<typeof detailsFormSchema>) {
    setIsSubmittingDetails(true);
    setError(null);
    setSuccess(null);

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    setIsSubmittingDetails(false);

    if (response.ok) {
      setSuccess(data.message); // "User created successfully. Please verify your email."
      setUserEmail(values.email);
      setStep('verify'); // Move to OTP verification step
      setError(null);
    } else {
      setError(data.message || 'An error occurred.');
      setSuccess(null);
    }
  }

  // Handler for the second step (submitting OTP)
  async function onOtpSubmit(values: z.infer<typeof otpFormSchema>) {
    setIsSubmittingOtp(true);
    setError(null);
    setSuccess(null);

    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, otp: values.otp }),
    });

    const data = await response.json();
    setIsSubmittingOtp(false);

    if (response.ok) {
      setSuccess(data.message); // "Email verified successfully."
      otpForm.reset();
      // Redirect to login with a query param to show success message
      router.push('/login?verified=true');
    } else {
      setError(data.message || 'An error occurred during OTP verification.');
      setSuccess(null);
    }
  }

  // Handler for resending OTP
  const handleResendOtp = async () => {
    setResendMessage(null);
    setError(null);

    const response = await fetch('/api/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail }),
    });

    const data = await response.json();

    if (response.ok) {
      setResendMessage(data.message);
    } else {
      setError(data.message || 'Failed to resend OTP.');
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      {step === 'details' && (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...detailsForm}>
              <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-4">
                <FormField
                  control={detailsForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+15551234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmittingDetails}>
                  {isSubmittingDetails && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmittingDetails ? 'Creating Account...' : 'Create an account'}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline text-primary">
                Sign in
              </Link>
            </div>
          </CardContent>
        </>
      )}

      {step === 'verify' && (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              A 6-digit code has been sent to <strong>{userEmail}</strong>. Please enter it below to verify your account.
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
            {success && ( // This will show the message from onDetailsSubmit initially
              <Alert className="mb-4 bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Code Sent</AlertTitle>
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
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
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
                <Button type="submit" className="w-full" disabled={isSubmittingOtp}>
                  {isSubmittingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmittingOtp ? 'Verifying...' : 'Verify Email'}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Didn't receive the code?{' '}
              <Button variant="link" onClick={handleResendOtp} disabled={isSubmittingOtp}>
                Resend OTP
              </Button>
            </div>
            <div className="mt-2 text-center text-sm">
              <Link href="/login" className="underline text-primary">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}