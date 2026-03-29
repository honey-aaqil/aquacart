import { LoginForm } from '@/components/auth/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-aq-surface">
        <div className="w-12 h-12 rounded-2xl animate-shimmer" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
