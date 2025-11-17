
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

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint?: string;
  category: string;
  quantity: number;
  availability: boolean;
}

const ProductModel = (): Model<IProduct> => mongoose.model<IProduct>('Product', ProductSchema);

export default (mongoose.models.Product as Model<IProduct>) || ProductModel();
