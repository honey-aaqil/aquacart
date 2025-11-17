// src/app/api/verify-email/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Token is missing.' }, { status: 400 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ emailVerificationToken: token });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 404 });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined; // Clear the token
    await user.save();

    return NextResponse.json({ message: 'Email successfully verified.' }, { status: 200 });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during email verification.' }, { status: 500 });
  }
}
