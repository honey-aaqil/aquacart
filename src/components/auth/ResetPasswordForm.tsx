'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Waves, CheckCircle, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/reset-password?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            setUserEmail(data.email);
          }
        })
        .catch(console.error);
    }
  }, [token]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: values.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to process request.');
      } else {
        setSuccess('Password has been successfully reset. You can now log in.');
        form.reset();
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-aq-surface p-4">
        <div className="w-full max-w-md aq-card-static p-8 text-center animate-fade-in-up">
          <AlertCircle className="w-12 h-12 text-aq-error mx-auto mb-4" />
          <h2 className="text-xl font-bold text-aq-on-surface mb-2">Invalid Link</h2>
          <p className="text-aq-on-surface-variant text-sm mb-6">
            The password reset link is missing or invalid. Please request a new one.
          </p>
          <Link href="/forgot-password" className="aq-btn-primary block w-full py-3 text-center">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-aq-surface p-4" id="reset-password-page">
      <div className="w-full max-w-md">
        <div className="aq-card-static p-8 md:p-10 animate-fade-in-up">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-aq-gradient-primary flex items-center justify-center shadow-aq-sm">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-aq-on-surface tracking-tight">Reset Password</h1>
              <p className="text-sm text-aq-on-surface-variant mt-1">Enter your new password below</p>
              {userEmail && <p className="text-xs font-medium text-aq-primary mt-2">{userEmail}</p>}
            </div>
          </div>

          {success && (
            <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 p-3.5 text-sm text-emerald-800 mb-5 animate-scale-in">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl bg-aq-error-container p-3.5 text-sm text-aq-error mb-5 animate-scale-in">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Hidden email input for password managers */}
            {userEmail && (
              <input 
                type="email" 
                autoComplete="username" 
                value={userEmail} 
                name="email" 
                readOnly 
                className="hidden" 
                style={{ display: 'none' }} 
              />
            )}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-aq-on-surface" htmlFor="password">
                New Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="aq-input h-12 px-4 text-sm"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <span className="text-xs text-aq-error">{form.formState.errors.password.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-aq-on-surface" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="aq-input h-12 px-4 text-sm"
                {...form.register('confirmPassword')}
              />
              {form.formState.errors.confirmPassword && (
                <span className="text-xs text-aq-error">{form.formState.errors.confirmPassword.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!success}
              className="aq-btn-primary h-12 text-sm w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <div className="text-center mt-4">
              <Link href="/login" className="text-sm font-medium text-aq-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
