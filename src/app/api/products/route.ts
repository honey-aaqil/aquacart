import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const allProducts = await ProductModel.find({});
    
    // Filter out invalid IDs (like we did before)
    const validProducts = allProducts.filter((product) =>
      mongoose.Types.ObjectId.isValid(product._id as any)
    );

    return NextResponse.json(validProducts, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// NEW: POST method to create a product
export async function POST(request: Request) {
  try {
    // 1. Security Check
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // 2. Create Product
    const newProduct = await ProductModel.create(body);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}