import Link from 'next/link';
import { Fish, Waves, Leaf, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GuestLanding() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-hidden font-display bg-background-light">
      <div className="flex flex-col">
        <div className="@container">
          <div 
            className="flex h-full min-h-[600px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-between p-6 pb-12" 
            style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.0) 0%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.5) 100%), url("https://images.unsplash.com/photo-1529230117798-3a4a96c94611?q=80&w=2560&auto=format&fit=crop")'
            }}
          >
            {/* Logo Section */}
            <div className="flex flex-col items-center gap-2 pt-6">
              <Fish className="text-white w-12 h-12" />
              <p className="text-white text-xl font-bold tracking-wider">FRESH CATCH</p>
            </div>

            {/* Hero Content */}
            <div className="w-full max-w-md flex flex-col items-center gap-8 pt-16">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                  The Freshest Catch, Delivered to You.
                </h1>
                <h2 className="text-white/90 text-base font-normal leading-normal md:text-lg">
                  Sustainable seafood sourced daily from local fishermen.
                </h2>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full items-center">
                <Button asChild size="lg" className="w-full max-w-xs text-base font-bold">
                  <Link href="/register">Sign Up</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full max-w-xs text-base font-bold">
                  <Link href="/login">Log In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background-light py-12 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-primary-dark text-center mb-8">Why Choose Us?</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Waves className="text-primary-medium w-8 h-8 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-primary-dark">Unbeatable Freshness</h3>
                <p className="text-primary-dark/80">From the ocean to your plate in record time.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Leaf className="text-primary-medium w-8 h-8 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-primary-dark">Sustainably Sourced</h3>
                <p className="text-primary-dark/80">Responsible fishing practices that protect our oceans.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Truck className="text-primary-medium w-8 h-8 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-primary-dark">Convenient Delivery</h3>
                <p className="text-primary-dark/80">Premium quality seafood delivered to your doorstep.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}