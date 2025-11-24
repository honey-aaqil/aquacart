import mongoose, { Document, Model, Schema } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  imageHint: { type: String },
  category: { type: String, required: true, index: true },
  quantity: { type: Number, required: true, min: 0, comment: "Stock quantity" },
  availability: { type: Boolean, default: true },
}, { timestamps: true });

// Backend Interface: Extends Mongoose Document (Use this in API routes)
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint?: string;
  category: string;
  quantity: number;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Frontend Interface: Pure Data (Use this in React Components)
export interface SerializedProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint?: string;
  category: string;
  quantity: number;
  availability: boolean;
  createdAt: string; // JSON converts Date to string
  updatedAt: string; // JSON converts Date to string
}

const ProductModel = (): Model<IProduct> => mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel();