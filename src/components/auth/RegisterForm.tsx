'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ALLOWED_EMAIL_DOMAINS } from '@/lib/constants';

// Validation Schema
const registerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email().refine(
    (email) => {
      const domain = email.split('@')[1];
      return ALLOWED_EMAIL_DOMAINS.includes(domain);
    },
    { message: 'Please use a Gmail, Yahoo, Outlook, or iCloud email.' }
  ),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: 'Enter a valid international phone number (e.g., +15551234).',
  }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  otp: z.string().optional(), 
});

export function RegisterForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [hasSentOtp, setHasSentOtp] = useState(false);

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

  // 1. Send OTP Logic
  const handleSendOtp = async () => {
    setApiError(null);
    setApiSuccess(null);

    const detailsValid = await form.trigger(['name', 'email', 'phone', 'password']);
    if (!detailsValid) {
      setApiError('Please fill in your details correctly before sending the code.');
      return;
    }

    setIsSendingOtp(true);
    const { name, email, phone, password } = form.getValues();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setApiSuccess(data.message);
        setHasSentOtp(true);
      } else {
        setApiError(data.message || 'An error occurred.');
      }
    } catch (err) {
      setApiError('Failed to connect to the server.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 2. Verify OTP Logic
  const handleVerifyOtp = async () => {
    setApiError(null);
    setApiSuccess(null);

    const otp = form.getValues('otp');
    if (!otp || otp.length !== 6) {
      setApiError('Please enter the 6-digit OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    const { email } = form.getValues();

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setApiSuccess(data.message);
        setIsEmailVerified(true);
      } else {
        setApiError(data.message || 'An error occurred during OTP verification.');
      }
    } catch (err) {
      setApiError('Failed to verify OTP.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 3. Final Submit Logic
  async function onRegisterSubmit() {
    setIsRegistering(true);
    router.push('/login?verified=true');
  }

  // Helper to show field errors
  const getFieldError = (field: keyof z.infer<typeof registerFormSchema>) => {
    return form.formState.errors[field]?.message;
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-lg">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="material-symbols-outlined text-5xl text-primary-dark">waves</span>
        <h1 className="text-3xl font-bold text-primary-dark">Create Account</h1>
        <p className="text-secondary">Join AquaFresh today!</p>
      </div>

      <form className="flex w-full flex-col gap-4" onSubmit={form.handleSubmit(onRegisterSubmit)}>
        <div className="flex flex-col gap-4">
          
          {/* NAME */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-primary-dark/80" htmlFor="name">Name</label>
            <input
              className="h-12 w-full rounded-lg border border-secondary/30 bg-card-light shadow-sm focus:border-primary focus:ring-primary px-4"
              id="name"
              placeholder="John Doe"
              type="text"
              disabled={isEmailVerified}
              {...form.register('name')}
            />
            {getFieldError('name') && <span className="text-xs text-red-500">{getFieldError('name')}</span>}
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-primary-dark/80" htmlFor="email">Email</label>
            <input
              className="h-12 w-full rounded-lg border border-secondary/30 bg-card-light shadow-sm focus:border-primary focus:ring-primary px-4"
              id="email"
              placeholder="you@example.com"
              type="email"
              disabled={isEmailVerified}
              {...form.register('email')}
            />
            {getFieldError('email') && <span className="text-xs text-red-500">{getFieldError('email')}</span>}
          </div>

          {/* PHONE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-primary-dark/80" htmlFor="phone">Phone Number</label>
            <input
              className="h-12 w-full rounded-lg border border-secondary/30 bg-card-light shadow-sm focus:border-primary focus:ring-primary px-4"
              id="phone"
              placeholder="+1234567890"
              type="tel"
              disabled={isEmailVerified}
              {...form.register('phone')}
            />
            {getFieldError('phone') && <span className="text-xs text-red-500">{getFieldError('phone')}</span>}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-primary-dark/80" htmlFor="password">Password</label>
            <input
              className="h-12 w-full rounded-lg border border-secondary/30 bg-card-light shadow-sm focus:border-primary focus:ring-primary px-4"
              id="password"
              placeholder="••••••••"
              type="password"
              disabled={isEmailVerified}
              {...form.register('password')}
            />
             {getFieldError('password') && <span className="text-xs text-red-500">{getFieldError('password')}</span>}
          </div>
        </div>

        {/* SEND OTP BUTTON */}
        {!isEmailVerified && (
          <div className="mt-2">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-base font-bold text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
            >
              {isSendingOtp ? 'Sending...' : hasSentOtp ? 'Resend Verification Code' : 'Send Verification Code'}
            </button>
          </div>
        )}

        {/* OTP SECTION */}
        {hasSentOtp && (
          <div className="my-2 flex w-full flex-col gap-4 border-t border-secondary/20 pt-4 animate-in fade-in slide-in-from-top-2">
            
            {/* Messages */}
            {apiSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-green-100 p-3 text-sm text-green-800">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{apiSuccess}</span>
              </div>
            )}
            
            {apiError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-800">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{apiError}</span>
              </div>
            )}

            {!isEmailVerified && (
              <div className="flex w-full items-end gap-3">
                <div className="flex flex-grow flex-col gap-2">
                  <label className="text-sm font-medium text-primary-dark/80" htmlFor="otp">OTP</label>
                  <input
                    className="h-12 w-full rounded-lg border border-secondary/30 bg-card-light shadow-sm focus:border-primary focus:ring-primary px-4"
                    id="otp"
                    placeholder="123456"
                    type="text"
                    disabled={isVerifyingOtp}
                    {...form.register('otp')}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp}
                  className="flex h-12 flex-shrink-0 items-center justify-center rounded-lg bg-secondary px-6 text-base font-bold text-white shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isVerifyingOtp ? '...' : 'Verify'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* FINAL SUBMIT */}
        <div className="mt-2 flex flex-col gap-3">
          <button
            type="submit"
            disabled={!isEmailVerified || isRegistering}
            className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-base font-bold text-white shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             {isRegistering ? 'Creating Account...' : 'Create an account'}
          </button>
          
          <div className="text-center">
            <p className="text-sm text-primary-dark/80">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-accent hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}