import CartView from '@/components/cart/CartView';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';

async function getUserAddresses() {
    const session = await auth();
    if (!session?.user?.id) return [];

    await dbConnect();
    const user = await UserModel.findById(session.user.id).select('addresses').lean();
    return user ? user.addresses : [];
}


export default async function CartPage() {
  const addresses = await getUserAddresses();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <CartView userAddresses={JSON.parse(JSON.stringify(addresses))} />
    </div>
  );
}
