// src/types/Product.ts
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint?: string;
  category: string;
  quantity: number;
  maxQuantity: number;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}
