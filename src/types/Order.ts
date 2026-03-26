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
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  orderStatus: string;
  createdAt: string;
}
