import AdminDashboard from "@/components/admin/AdminDashboard";
import { Suspense } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ProductManager from "@/components/admin/ProductManager";

export default function AdminPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage your store.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview">Live Feed</TabsTrigger>
          <TabsTrigger value="products">Manage Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Suspense fallback={<div>Loading dashboard...</div>}>
            <AdminDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductManager />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}