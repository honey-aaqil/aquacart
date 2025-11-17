import AdminDashboard from "@/components/admin/AdminDashboard";
import { Suspense } from "react";

export default function AdminPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage your store.</p>
      </div>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <AdminDashboard />
      </Suspense>
    </div>
  );
}
