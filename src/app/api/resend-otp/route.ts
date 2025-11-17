import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email } = await req.json();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: 'Email already verified.' }, { status: 400 });
    }

    const emailVerificationOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const emailVerificationOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    user.emailVerificationToken = emailVerificationOtp;
    user.emailVerificationTokenExpiry = emailVerificationOtpExpiry;

    await user.save();

    await sendVerificationEmail(user.email, emailVerificationOtp);

    return NextResponse.json({ message: 'New OTP sent to your email.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
