import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, phone, password } = await req.json();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      // If user exists but is not verified, update OTP and resend
      if (!existingUser.isEmailVerified) {
        const emailVerificationOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const emailVerificationOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        existingUser.emailVerificationToken = emailVerificationOtp;
        existingUser.emailVerificationTokenExpiry = emailVerificationOtpExpiry;
        existingUser.name = name; // Update name/phone/password in case they changed
        existingUser.phone = phone;
        existingUser.password = await bcrypt.hash(password, 10);
        
        await existingUser.save();
        await sendVerificationEmail(existingUser.email, emailVerificationOtp);

        return NextResponse.json({ message: 'User already exists but is not verified. A new OTP has been sent.' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'User already exists with this email' }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const emailVerificationOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const newUser = new UserModel({
      name,
      email,
      phone,
      password: hashedPassword,
      emailVerificationToken: emailVerificationOtp,
      emailVerificationTokenExpiry: emailVerificationOtpExpiry,
    });

    await newUser.save();

    // Fixed the bug here: used emailVerificationOtp instead of undefined emailVerificationToken
    await sendVerificationEmail(newUser.email, emailVerificationOtp);

    return NextResponse.json({ message: 'User created successfully. Please verify your email.' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}