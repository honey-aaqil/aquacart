'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { IOrder } from '@/models/Order';
import { format } from 'date-fns';

export default function OrderHistory({ orders }: { orders: IOrder[] }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Delivered': return 'default';
        case 'Confirmed': return 'secondary';
        case 'Out for Delivery': return 'outline';
        default: return 'destructive';
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg">
        <h3 className="text-xl font-semibold">No Orders Yet</h3>
        <p className="text-muted-foreground mt-2">You haven&apos;t placed any orders.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {orders.map((order) => (
        <AccordionItem key={order._id} value={order._id}>
          <AccordionTrigger>
            <div className="flex justify-between w-full pr-4 items-center">
              <div className="text-left">
                <p className="font-medium">Order #{order._id.slice(-6)}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), 'PPP')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                <Badge variant={getStatusVariant(order.orderStatus)} className="mt-1">{order.orderStatus}</Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="divide-y">
                {order.items.map((item) => (
                    <div key={item._id} className="py-2 flex justify-between items-center">
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <div className="pt-4 mt-4 border-t">
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
