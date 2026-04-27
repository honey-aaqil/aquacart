'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/Order';
import { ORDER_STATUS } from '@/lib/constants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function OrderActions({ order }: { order: Order }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  const createdAt = new Date(order.createdAt).getTime();
  const now = Date.now();
  const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
  const canCancel = hoursSinceCreation <= 24 && 
                    order.orderStatus !== ORDER_STATUS.CANCELLED && 
                    order.orderStatus !== ORDER_STATUS.DELIVERED;
  const canRefund = order.orderStatus === ORDER_STATUS.DELIVERED && 
                    order.refundStatus === 'None';

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      const res = await fetch(`/api/orders/${order._id}/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to cancel order');
      }

      toast({
        title: 'Order Cancelled',
        description: 'Your order has been cancelled successfully and stock restored.',
      });
      
      router.refresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRequestRefund = async () => {
    if (refundReason.length < 10) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please provide a more detailed reason for the refund (minimum 10 characters).',
      });
      return;
    }

    try {
      setIsRefunding(true);
      const res = await fetch(`/api/orders/${order._id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refundReason }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to request refund');
      }

      toast({
        title: 'Refund Requested',
        description: 'Your refund request has been submitted successfully.',
      });
      
      setIsRefundDialogOpen(false);
      setRefundReason('');
      router.refresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsRefunding(false);
    }
  };

  if (!canCancel && !canRefund) {
    return null;
  }

  return (
    <div className="mt-4 flex gap-2">
      {canCancel && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">Cancel Order</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently cancel your order #{order._id.slice(-6)}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Order</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelOrder} disabled={isCancelling} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Yes, cancel order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {canRefund && (
        <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">Request Refund</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Refund</DialogTitle>
              <DialogDescription>
                Please provide a reason for requesting a refund for order #{order._id.slice(-6)}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Briefly describe the issue with your order..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleRequestRefund} disabled={isRefunding}>
                {isRefunding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
