import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import crypto from 'crypto';

/**
 * Client-side payment verification endpoint.
 * Called after the Razorpay modal closes with success.
 * Verifies the payment signature to confirm authenticity.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  // Verify payment signature
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
  }

  await dbConnect();

  try {
    // Save the signature to order (webhook may have already processed, but this is the client confirmation)
    const order = await OrderModel.findOneAndUpdate(
      {
        _id: orderId,
        userId: session.user.id,
        razorpayOrderId: razorpay_order_id,
      },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Payment verified successfully',
      orderId: order._id.toString(),
      paymentStatus: order.paymentStatus,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
