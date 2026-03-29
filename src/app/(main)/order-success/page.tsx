import Link from "next/link";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="bg-aq-surface min-h-screen flex items-center justify-center p-4" id="order-success">
      <div className="aq-card-static p-8 md:p-12 max-w-lg w-full text-center animate-scale-in">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 mx-auto flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-aq-tertiary" />
        </div>

        <h1 className="text-3xl font-extrabold text-aq-on-surface tracking-tight mb-2">
          Order Placed!
        </h1>
        <p className="text-aq-on-surface-variant mb-8 leading-relaxed">
          Thank you for your purchase. Our team will contact you shortly to confirm the details and delivery schedule.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 aq-btn-primary h-11 px-6 text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 aq-btn-outline h-11 px-6 text-sm"
          >
            View Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
