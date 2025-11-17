'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Loader2, Minus, Plus, Trash2, ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { IProduct } from '@/models/Product';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type CartItem = {
  productId: IProduct & { _id: string };
  quantity: number;
};

type Cart = {
  items: CartItem[];
};

export default function CartView({ userAddresses }: { userAddresses: any[] }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const defaultAddress = userAddresses.find(addr => addr.isDefault);

  useEffect(() => {
    if (session) {
      fetchCart();
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      setCart(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch cart.' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 0) return;
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to update quantity');
      fetchCart();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update item quantity.' });
    }
  };

  const placeOrder = async () => {
    if (!defaultAddress) {
        toast({ variant: 'destructive', title: 'No Default Address', description: 'Please set a default shipping address in your account settings.' });
        return;
    }
    setIsPlacingOrder(true);
    try {
        const res = await fetch('/api/orders', { method: 'POST' });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to place order');
        }
        toast({ title: 'Order Placed!', description: 'Your order is in the queue.' });
        router.push('/order-success');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Order Failed', description: error.message });
        setIsPlacingOrder(false);
    }
  };

  const subtotal = cart?.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0) || 0;

  if (isLoading) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">Your Cart is Empty</h2>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <Card key={item.productId._id} className="flex items-center p-4">
            <Image src={item.productId.imageUrl} alt={item.productId.name} width={80} height={80} className="rounded-md object-cover" />
            <div className="ml-4 flex-grow">
              <Link href={`/shop/${item.productId._id}`} className="font-semibold hover:underline">{item.productId.name}</Link>
              <p className="text-sm text-muted-foreground">${item.productId.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
              <span>{item.quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <p className="w-24 text-right font-semibold mx-4">${(item.productId.price * item.quantity).toFixed(2)}</p>
            <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.productId._id, 0)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </Card>
        ))}
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {!defaultAddress && (
                <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Address Missing</AlertTitle>
                    <AlertDescription>
                        You must set a default shipping address in your <Link href="/account" className="font-bold underline">Account</Link> to place an order.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={placeOrder} disabled={!defaultAddress || isPlacingOrder}>
              {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
