import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | AquaCart',
  description: 'Reset your AquaCart password',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
