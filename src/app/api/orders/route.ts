import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import OrderModel from '@/models/Order';
import ProductModel from '@/models/Product';
import mongoose from 'mongoose';

async function notifyWebSocketServer(orderData: any) {
  try {
    // The WebSocket server runs as a separate process, so we notify it via an HTTP POST request
    // to its internal broadcast endpoint.
    const wsInternalUrl = `http://localhost:${process.env.WSS_PORT || '3001'}/broadcast`;
    
    await fetch(wsInternalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
  } catch (error) {
    console.error('Failed to notify WebSocket server:', error);
    // Important: Do not block the main order creation flow if the WebSocket notification fails.
    // Log the error for monitoring.
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const user = await UserModel.findById(session.user.id).populate('cart.items.productId').session(dbSession);

    if (!user) {
      throw new Error('User not found.');
    }
    if (!user.cart || user.cart.items.length === 0) {
      throw new Error('Cart is empty.');
    }

    const defaultAddress = user.addresses.find(addr => addr.isDefault);
    if (!defaultAddress) {
      throw new Error('No default address set.');
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of user.cart.items) {
      const product = item.productId as any;
      if (!product || !product.availability || product.quantity < item.quantity) {
        throw new Error(`Product "${product?.name || 'Unknown'}" is out of stock or quantity not available.`);
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      // Decrement stock
      await ProductModel.findByIdAndUpdate(product._id, { $inc: { quantity: -item.quantity } }).session(dbSession);
    }
    
    // Check if any product quantity has dropped to 0 and update availability
    await ProductModel.updateMany(
        { _id: { $in: orderItems.map(i => i.productId) }, quantity: { $lte: 0 } },
        { $set: { availability: false } }
    ).session(dbSession);


    const newOrder = new OrderModel({
      userId: user._id,
      customerName: user.name,
      customerPhone: user.phone,
      items: orderItems,
      totalAmount,
      deliveryAddress: {
        street: defaultAddress.street,
        city: defaultAddress.city,
        state: defaultAddress.state,
        zipCode: defaultAddress.zipCode,
      },
    });

    await newOrder.save({ session: dbSession });
    
    user.cart.items = [];
    await user.save({ session: dbSession });

    await dbSession.commitTransaction();

    // Notify WebSocket server outside of the transaction
    await notifyWebSocketServer({
        orderId: newOrder._id.toString(),
        totalPrice: newOrder.totalAmount,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
    });

    return NextResponse.json({ message: 'Order placed successfully', orderId: newOrder._id }, { status: 201 });

  } catch (error: any) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction();
    }
    console.error('Order placement error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  } finally {
    dbSession.endSession();
  }
}
