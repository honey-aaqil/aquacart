import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const getBaseUrl = () => process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || 'http://localhost:3000';

const emailStyles = `
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; background-color: #f7f9fe; margin: 0; padding: 20px; color: #181c20; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0px 4px 12px rgba(24, 28, 32, 0.06); }
    .logo { width: 56px; height: 56px; background: linear-gradient(135deg, #0050cb 0%, #0066ff 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px; color: white; font-weight: bold; font-size: 24px; text-align: center; line-height: 56px;}
    .title { font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #181c20; }
    .text { font-size: 16px; line-height: 1.5; color: #424656; margin-bottom: 24px; }
    .code { font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #0050cb; text-align: center; margin: 32px 0; padding: 16px; background-color: #f1f4f9; border-radius: 12px; }
    .button { display: inline-block; background-color: #0050cb; color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 9999px; text-align: center; }
    .footer { font-size: 14px; color: #727687; margin-top: 40px; text-align: center; }
  </style>
`;

export async function sendVerificationEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your AquaCart email address',
    html: `
      <!DOCTYPE html>
      <html>
      <head>${emailStyles}</head>
      <body>
        <div class="container">
          <div class="logo">AQ</div>
          <h1 class="title">Verify your email address</h1>
          <p class="text">Thank you for joining AquaCart! Please use the verification code below to complete your registration.</p>
          <div class="code">${otp}</div>
          <p class="text">This code will expire in 15 minutes.</p>
          <div class="footer">&copy; ${new Date().getFullYear()} AquaCart. All rights reserved.</div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${getBaseUrl()}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your AquaCart password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>${emailStyles}</head>
      <body>
        <div class="container">
          <div class="logo">AQ</div>
          <h1 class="title">Password Reset Request</h1>
          <p class="text">We received a request to reset the password for your AquaCart account. Click the button below to set a new password.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" class="button" style="color: white;">Reset Password</a>
          </div>
          <p class="text" style="font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <div class="footer">&copy; ${new Date().getFullYear()} AquaCart. All rights reserved.</div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}