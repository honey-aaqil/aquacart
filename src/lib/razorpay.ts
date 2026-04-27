import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay {
  if (!razorpayInstance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables.');
    }

    razorpayInstance = new Razorpay({ key_id, key_secret });
  }
  return razorpayInstance;
}

export function getRazorpayKeyId(): string {
  const key = process.env.RAZORPAY_KEY_ID;
  if (!key) throw new Error('RAZORPAY_KEY_ID is not set');
  return key;
}
