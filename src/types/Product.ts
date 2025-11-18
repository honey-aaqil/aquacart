// src/types/Product.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint?: string;
  category: string;
  quantity: number;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}
