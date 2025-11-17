import AddressManager from "@/components/account/AddressManager";
import OrderHistory from "@/components/account/OrderHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import { Home, Package, User as UserIcon } from "lucide-react";

async function getAccountData() {
    const session = await auth();
    if (!session?.user?.id) return { user: null, orders: [] };

    await dbConnect();
    const user = await UserModel.findById(session.user.id).select('name email phone addresses').lean();
    const orders = await OrderModel.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

    return { 
        user: JSON.parse(JSON.stringify(user)), 
        orders: JSON.parse(JSON.stringify(orders))
    };
}


export default async function AccountPage() {
  const { user, orders } = await getAccountData();

  if (!user) {
    return <div className="container py-8 text-center">Please log in to view your account.</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders"><Package className="mr-2 h-4 w-4" />Order History</TabsTrigger>
          <TabsTrigger value="addresses"><Home className="mr-2 h-4 w-4" />Addresses</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
            <OrderHistory orders={orders} />
        </TabsContent>
        <TabsContent value="addresses">
            <AddressManager initialAddresses={user.addresses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
