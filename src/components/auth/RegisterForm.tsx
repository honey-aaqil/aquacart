'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Terminal, CheckCircle } from 'lucide-react';
import { ALLOWED_EMAIL_DOMAINS } from '@/lib/constants';

// A single schema for the entire form
const registerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z
    .string()
    .email()
    .refine(
      (email) => {
        const domain = email.split('@')[1];
        return ALLOWED_EMAIL_DOMAINS.includes(domain);
      },
      { message: 'Please use a Gmail, Yahoo, Outlook, or iCloud email.' }
    ),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, {
      message:
        'Enter a valid international phone number (e.g., +15551234).',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
  otp: z.string().length(6, { message: 'OTP must be 6 digits.' }),
});

export function RegisterForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // For the final submit button
  const [hasSentOtp, setHasSentOtp] = useState(false);

  // Single form instance
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      otp: '',
    },
  });

  // Step 1: Send OTP after filling details
  const handleSendOtp = async () => {
    setApiError(null);
    setApiSuccess(null);

    // Validate only the user details first
    const detailsValid = await form.trigger([
      'name',
      'email',
      'phone',
      'password',
    ]);
    if (!detailsValid) {
      setApiError(
        'Please fill in your details (name, email, phone, password) correctly before sending the code.'
      );
      return;
    }

    setIsSendingOtp(true);
    const { name, email, phone, password } = form.getValues();

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await response.json();
    setIsSendingOtp(false);

    if (response.ok) {
      setApiSuccess(data.message); // "User created successfully. Please verify your email."
      setHasSentOtp(true);
    } else {
      setApiError(data.message || 'An error occurred.');
    }
  };

  // Step 2: Verify the OTP
  const handleVerifyOtp = async () => {
    setApiError(null);
    setApiSuccess(null);

    // Validate email and OTP fields
    const otpValid = await form.trigger(['email', 'otp']);
    if (!otpValid) {
      setApiError('Please enter your email and the 6-digit OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    const { email, otp } = form.getValues();

    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    setIsVerifyingOtp(false);

    if (response.ok) {
      setApiSuccess(data.message); // "Email verified successfully."
      setIsEmailVerified(true);
      form.clearErrors('otp');
    } else {
      setApiError(data.message || 'An error occurred during OTP verification.');
    }
  };

  // Step 3: "Create Account" - only redirects, as creation/verification is done
  async function onRegisterSubmit(values: z.infer<typeof registerFormSchema>) {
    // This function is only reachable if isEmailVerified is true,
    // because the submit button is disabled otherwise.
    // The user is already created (in handleSendOtp) and verified (in handleVerifyOtp).
    // We just need to redirect them to login.
    setIsRegistering(true);
    router.push('/login?verified=true');
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          {isEmailVerified
            ? 'Your email is verified! Click "Create Account".'
            : hasSentOtp
            ? 'Enter the code sent to your email.'
            : 'Enter your information to create an account.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        {apiSuccess && (
          <Alert className="mb-4 bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{apiSuccess}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onRegisterSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={isEmailVerified}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      {...field}
                      disabled={isEmailVerified}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+15551234567"
                      {...field}
                      disabled={isEmailVerified}
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      disabled={isEmailVerified}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Send OTP Button */}
            {!isEmailVerified && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
              >
                {isSendingOtp ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isSendingOtp
                  ? 'Sending Code...'
                  : hasSentOtp
                  ? 'Resend Code'
                  : 'Send Verification Code'}
              </Button>
            )}

            {/* OTP Field and Verify Button */}
            {hasSentOtp && !isEmailVerified && (
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="XXXXXX"
                          {...field}
                          disabled={isVerifyingOtp || isEmailVerified}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleVerifyOtp}
                          disabled={isVerifyingOtp || isEmailVerified}
                        >
                          {isVerifyingOtp ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            'Verify'
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isEmailVerified && (
                <Alert variant="default" className="flex items-center bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <AlertDescription className="text-green-700 dark:text-green-300 font-medium">
                        Email verified! You can now create your account.
                    </AlertDescription>
                </Alert>
            )}

            {/* Final Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isEmailVerified || isRegistering}
            >
              {isRegistering && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create an account
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
    </Card>
  );
}