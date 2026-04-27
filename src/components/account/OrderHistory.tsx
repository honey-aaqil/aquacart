'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/Order';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import {
  Loader2, Package, ShoppingBag, Clock, CheckCircle2, Truck, PackageCheck,
  XCircle, Download, ChevronDown, ChevronUp, IndianRupee, FileText,
} from 'lucide-react';
import { format } from 'date-fns';

// Timeline step definitions
const TIMELINE_STEPS = [
  { key: ORDER_STATUS.PENDING, label: 'Order Placed', icon: Clock, color: 'text-yellow-500' },
  { key: ORDER_STATUS.CONFIRMED, label: 'Confirmed', icon: Package, color: 'text-blue-500' },
  { key: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery', icon: Truck, color: 'text-purple-500' },
  { key: ORDER_STATUS.DELIVERED, label: 'Delivered', icon: PackageCheck, color: 'text-green-500' },
];

function getTimelineProgress(orderStatus: string): number {
  const idx = TIMELINE_STEPS.findIndex((s) => s.key === orderStatus);
  return idx >= 0 ? idx : 0;
}

function OrderTimeline({ orderStatus }: { orderStatus: string }) {
  const isCancelled = orderStatus === ORDER_STATUS.CANCELLED;
  const progress = getTimelineProgress(orderStatus);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
        <XCircle className="h-5 w-5 text-red-500" />
        <span className="text-sm font-semibold text-red-600 dark:text-red-400">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="py-4 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700" />
        {/* Progress line */}
        <div
          className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700 ease-out"
          style={{ width: `calc(${(progress / (TIMELINE_STEPS.length - 1)) * 100}% - 2rem)` }}
        />

        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= progress;
          const isCurrent = index === progress;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10" style={{ flex: 1 }}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 
                  ${isCompleted
                    ? isCurrent
                      ? 'bg-primary shadow-lg shadow-primary/30 scale-110'
                      : 'bg-primary'
                    : 'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                <StepIcon className={`h-4 w-4 ${isCompleted ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
              </div>
              <span
                className={`text-[10px] mt-2 text-center leading-tight max-w-[70px]
                  ${isCurrent ? 'font-bold text-primary' : isCompleted ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order, isExpanded, onToggle }: { order: Order; isExpanded: boolean; onToggle: () => void }) {
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRequestingRefund, setIsRequestingRefund] = useState(false);

  const canCancel = order.orderStatus === ORDER_STATUS.PENDING && order.paymentStatus === PAYMENT_STATUS.PENDING;
  const canRequestRefund =
    order.paymentStatus === PAYMENT_STATUS.PAID &&
    order.refundStatus !== 'Requested' &&
    order.refundStatus !== 'Approved' &&
    order.orderStatus !== ORDER_STATUS.DELIVERED;

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order._id}/cancel`, { method: 'POST' });
      if (!res.ok) throw new Error((await res.json()).message);
      toast({ title: 'Order Cancelled' });
      window.location.reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRequestRefund = async () => {
    setIsRequestingRefund(true);
    try {
      const res = await fetch(`/api/orders/${order._id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Customer requested refund' }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      toast({ title: 'Refund Requested', description: 'Admin will review your request shortly.' });
      window.location.reload();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsRequestingRefund(false);
    }
  };

  const paymentBadgeClass = () => {
    switch (order.paymentStatus) {
      case PAYMENT_STATUS.PAID: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case PAYMENT_STATUS.PENDING: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case PAYMENT_STATUS.FAILED: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case PAYMENT_STATUS.REFUNDED: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return '';
    }
  };

  return (
    <div className="aq-card-static overflow-hidden transition-all duration-300">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-aq-surface-container/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-aq-on-surface-variant bg-aq-surface-container px-2 py-0.5 rounded">
              #{order._id.slice(-6)}
            </span>
            <Badge variant="outline" className={`text-[10px] border ${paymentBadgeClass()}`}>
              {order.paymentStatus}
            </Badge>
            {order.refundStatus && order.refundStatus !== 'None' && (
              <Badge variant="secondary" className="text-[10px]">
                Refund: {order.refundStatus}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm font-bold text-aq-on-surface flex items-center gap-0.5">
              <IndianRupee className="h-3.5 w-3.5" />
              {order.totalAmount.toFixed(2)}
            </span>
            <span className="text-xs text-aq-on-surface-variant">
              {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-aq-on-surface-variant hidden sm:block">{order.items.length} item(s)</span>
          {isExpanded ? <ChevronUp className="h-4 w-4 text-aq-outline" /> : <ChevronDown className="h-4 w-4 text-aq-outline" />}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-aq-outline-variant/10">
          {/* Timeline */}
          <div className="px-4 md:px-5">
            <OrderTimeline orderStatus={order.orderStatus} />
          </div>

          {/* Items */}
          <div className="px-4 md:px-5 pb-4 space-y-2">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between py-2.5 px-3 bg-aq-surface-container/40 rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Package className="h-4 w-4 text-aq-outline shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-aq-on-surface truncate">{item.name}</p>
                    <p className="text-xs text-aq-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-aq-on-surface shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 px-4 md:px-5 pb-4 flex-wrap">
            {/* Invoice Download */}
            {order.invoiceUrl && (
              <a
                href={order.invoiceUrl}
                download
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Download Invoice
                <Download className="h-3 w-3" />
              </a>
            )}

            {canCancel && (
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleCancel} disabled={isCancelling}>
                {isCancelling ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                Cancel Order
              </Button>
            )}

            {canRequestRefund && (
              <Button variant="outline" size="sm" className="h-8 text-xs text-amber-600 border-amber-200 hover:bg-amber-50" onClick={handleRequestRefund} disabled={isRequestingRefund}>
                {isRequestingRefund ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                Request Refund
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistory() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (session) fetchOrders();
  }, [session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
      // Auto-expand the first order
      if (data.length > 0) setExpandedId(data[0]._id);
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load order history.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-aq-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-aq-surface-container mx-auto flex items-center justify-center mb-4">
          <ShoppingBag className="h-8 w-8 text-aq-outline" />
        </div>
        <h3 className="text-lg font-bold text-aq-on-surface">No Orders Yet</h3>
        <p className="text-sm text-aq-on-surface-variant mt-1">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          isExpanded={expandedId === order._id}
          onToggle={() => setExpandedId(expandedId === order._id ? null : order._id)}
        />
      ))}
    </div>
  );
}
