'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Waves, CheckCircle, AlertCircle } from 'lucide-react';

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
    defaultValues: { email: '', password: '' },
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
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-aq-surface p-4" id="login-page">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="aq-card-static p-8 md:p-10 animate-fade-in-up">
          {/* Logo & Header */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-aq-gradient-primary flex items-center justify-center shadow-aq-sm">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-aq-on-surface tracking-tight">Welcome Back</h1>
              <p className="text-sm text-aq-on-surface-variant mt-1">Sign in to your AquaCart account</p>
            </div>
          </div>

          {/* Alerts */}
          {emailVerified && (
            <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 p-3.5 text-sm text-emerald-800 mb-5 animate-scale-in">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Your email has been verified. You can now sign in.</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl bg-aq-error-container p-3.5 text-sm text-aq-error mb-5 animate-scale-in">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-aq-on-surface" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className="aq-input h-12 px-4 text-sm"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <span className="text-xs text-aq-error">{form.formState.errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-aq-on-surface" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className="aq-input h-12 px-4 text-sm"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <span className="text-xs text-aq-error">{form.formState.errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="aq-btn-primary h-12 text-sm w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              id="login-submit"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/register')}
              className="aq-btn-outline h-12 text-sm w-full"
              id="login-register-link"
            >
              Create Account
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p className="text-center text-xs text-aq-on-surface-variant mt-6">
          By signing in, you agree to our{' '}
          <span className="text-aq-primary font-medium cursor-pointer">Terms of Service</span>
        </p>
      </div>
    </div>
  );
}