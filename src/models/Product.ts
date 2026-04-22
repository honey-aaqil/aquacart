import mongoose, { Document, Model, Schema } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0, comment: "Price per piece" },
  pricePerKg: { type: Number, required: true, min: 0, default: 0, comment: "Price per kilogram" },
  imageUrl: { type: String, required: true },
  imageHint: { type: String },
  category: { type: String, required: true, index: true },
  quantity: { type: Number, required: true, min: 0, comment: "Stock quantity (pieces)" },
  stockKg: { type: Number, required: true, default: 0, min: 0, comment: "Stock weight (kg)" },
  availability: { type: Boolean, default: true },
}, { timestamps: true });

// Backend Interface: Extends Mongoose Document (Use this in API routes)
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  pricePerKg: number;
  imageUrl: string;
  imageHint?: string;
  category: string;
  quantity: number;
  stockKg: number;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Frontend Interface: Pure Data (Use this in React Components)
export interface SerializedProduct {
  _id: string; // Convert ObjectId to string
  name: string;
  slug: string;
  description: string;
  price: number;
  pricePerKg: number;
  imageUrl: string;
  imageHint?: string;
  category: string;
  quantity: number;
  stockKg: number;
  availability: boolean;
  createdAt: string; // JSON converts Date to string
  updatedAt: string; // JSON converts Date to string
}

const ProductModel = (): Model<IProduct> => mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel();