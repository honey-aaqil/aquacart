import { ProductCard } from '@/components/products/ProductCard';
import dbConnect from '@/lib/mongodb';
import ProductModel, { SerializedProduct } from '@/models/Product';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ROLES } from '@/lib/constants';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ProductManager from '@/components/admin/ProductManager';
import { Crown, Package, BarChart3 } from 'lucide-react';

export default async function AdminPage() {
  const session = await auth();
  if (!session || session.user?.role !== ROLES.ADMIN) {
    redirect('/login');
  }

  return (
    <div className="bg-aq-surface min-h-screen">
      <div className="container py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-aq-gradient-hero flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-aq-on-surface tracking-tight">Admin Panel</h1>
            <p className="text-xs text-aq-on-surface-variant">Manage products & monitor orders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminDashboard />
          <ProductManager />
        </div>
      </div>
    </div>
  );
}