import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth'; // Import auth to protect the route

export async function GET(request: any, context: any) {
  try {
    await dbConnect();
    const { id } = context.params;
    let productId = Array.isArray(id) ? id[0] : id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// NEW: Add the DELETE handler
export async function DELETE(request: any, context: any) {
  try {
    // 1. Check for admin session
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Connect to DB
    await dbConnect();
    const { id } = context.params;
    let productId = Array.isArray(id) ? id[0] : id;

    // 3. Validate ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // 4. Find and delete the product
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // 5. Return success
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}