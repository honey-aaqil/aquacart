
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const products = await ProductModel.find({});

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
