import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Reset Password | AquaCart',
  description: 'Set a new password for your AquaCart account',
};

// Fallback for the suspense boundary
function ResetPasswordFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-aq-surface p-4">
      <div className="w-full max-w-md aq-card-static p-8 text-center animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-gray-200 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
