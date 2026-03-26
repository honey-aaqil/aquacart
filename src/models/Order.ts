
import mongoose, { Document, Model, Schema } from 'mongoose';
import { ORDER_STATUS } from '@/lib/constants';

// Order Item Schema
const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

// Embedded Address Schema for the order
const DeliveryAddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
});

// Order Schema
const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: DeliveryAddressSchema, required: true },
  paymentMethod: { type: String, default: 'Offline Confirmation' },
  paymentStatus: { type: String, default: 'Pending' },
  orderStatus: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
}, { timestamps: true });

export interface IOrderItem extends Document {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  items: IOrderItem[];
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderModel = (): Model<IOrder> => mongoose.model<IOrder>('Order', OrderSchema);

export default (mongoose.models.Order as Model<IOrder>) || OrderModel();
