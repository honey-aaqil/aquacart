// src/types/Order.ts
import { Address } from './Address';

export interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  refundStatus?: 'None' | 'Requested' | 'Approved' | 'Rejected';
  refundReason?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt?: string;
}
