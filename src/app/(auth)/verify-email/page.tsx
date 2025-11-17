'use client';

import dynamic from 'next/dynamic';

const VerifyEmailForm = dynamic(() => import('@/components/auth/VerifyEmailForm').then((mod) => mod.VerifyEmailForm), {
  ssr: false,
});

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <VerifyEmailForm />
    </div>
  );
}
