import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import mongoose from 'mongoose'; // Make sure this is imported

export async function GET() {
  try {
    await dbConnect();

    // 1. Fetch ALL products from the database
    const allProducts = await ProductModel.find({});

    // 2. Filter out any products with an invalid MongoDB ObjectId
    const validProducts = allProducts.filter((product) =>
      // FIXED: Added 'as any' to fix the TypeScript error
      mongoose.Types.ObjectId.isValid(product._id as any)
    );

    // 3. Return only the valid products
    return NextResponse.json(validProducts, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}