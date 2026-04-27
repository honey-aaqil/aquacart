
import mongoose, { Document, Model, Schema } from 'mongoose';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';

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
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: DeliveryAddressSchema, required: true },
  paymentMethod: { type: String, default: 'Razorpay' },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
  },
  orderStatus: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
  refundStatus: { type: String, enum: ['None', 'Requested', 'Approved', 'Rejected'], default: 'None' },
  refundReason: { type: String, required: false },

  // Razorpay fields
  razorpayOrderId: { type: String, index: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },

  // Invoice
  invoiceUrl: { type: String },

  // Idempotency for webhook dedup
  idempotencyKey: { type: String, unique: true, sparse: true },
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
  customerEmail: string;
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
  refundStatus: 'None' | 'Requested' | 'Approved' | 'Rejected';
  refundReason?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  invoiceUrl?: string;
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderModel = (): Model<IOrder> => mongoose.model<IOrder>('Order', OrderSchema);

// Clear cache in development to prevent schema validation issues with hot reloading
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Order;
}

export default (mongoose.models.Order as Model<IOrder>) || OrderModel();
