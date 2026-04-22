'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import { Waves, CheckCircle, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to process request.');
      } else {
        setSuccess(data.message || 'Password reset link sent.');
        form.reset();
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-aq-surface p-4" id="forgot-password-page">
      <div className="w-full max-w-md">
        <div className="aq-card-static p-8 md:p-10 animate-fade-in-up">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-aq-gradient-primary flex items-center justify-center shadow-aq-sm">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-aq-on-surface tracking-tight">Forgot Password</h1>
              <p className="text-sm text-aq-on-surface-variant mt-1">Enter your email to receive a reset link</p>
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
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-aq-on-surface" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="aq-input h-12 px-4 text-sm"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <span className="text-xs text-aq-error">{form.formState.errors.email.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!success}
              className="aq-btn-primary h-12 text-sm w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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
