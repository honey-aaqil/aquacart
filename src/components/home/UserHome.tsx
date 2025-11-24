'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Waves, Search, Home as HomeIcon, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';

// FIX: Import the image directly. 
// Make sure UserHome.png is moved to src/images/UserHome.png
import heroImage from '@/images/UserHome.png'; 

export default function UserHome() {
  // Animation variants for individual cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.2, // Stagger effect: 0s, 0.2s, 0.4s
        duration: 0.6, 
        ease: "easeOut" 
      }
    }),
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary-dark dark:text-gray-200 min-h-screen flex flex-col">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center bg-primary-dark p-4 justify-between shadow-lg gap-4 md:px-8 md:py-5">
          <div className="flex items-center gap-2 shrink-0">
            <Waves className="text-highlight w-8 h-8" />
            <h1 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] md:text-2xl">AquaFresh</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow pb-24 md:pb-12">
          {/* Hero Section */}
          <div className="relative h-56 w-full md:h-[450px] lg:h-[500px]">
            <Image 
              src={heroImage} // Using the imported image variable
              alt="Fresh seafood hero"
              fill
              className="object-cover"
              priority
              placeholder="blur" // Adds a nice blur effect while loading
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,23,119,0.4)] to-[rgba(7,23,119,0.1)]" />
          </div>

          {/* Content Sections */}
          <div className="flex flex-col gap-8 -mt-16 p-4 relative z-10 md:mt-12 md:grid md:grid-cols-3 md:gap-8 md:max-w-7xl md:mx-auto md:px-8">
            
            {/* Card 1: Our Story */}
            <motion.section 
              custom={0} // 1st item
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-xl bg-card-light dark:bg-card-dark p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            >
              <h2 className="mb-3 text-2xl font-bold leading-tight tracking-[-0.015em] text-primary">Our Story</h2>
              <p className="text-sm font-normal leading-relaxed text-primary-dark/80 dark:text-gray-300 flex-grow">
                Founded by a family of fishermen with generations of experience, AquaFresh began with a simple mission: to bring the freshest, highest-quality seafood directly from the ocean to your table. We saw a gap between the hard-working people catching the fish and the families wanting to enjoy it.
              </p>
            </motion.section>

            {/* Card 2: Quality Promise */}
            <motion.section 
              custom={1} // 2nd item (delayed)
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-xl bg-card-light dark:bg-card-dark p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            >
                <h2 className="mb-3 text-2xl font-bold leading-tight tracking-[-0.015em] text-primary">Our Quality Promise</h2>
                <p className="text-sm font-normal leading-relaxed text-primary-dark/80 dark:text-gray-300 flex-grow">
                Quality isn't just a word for us; it's our bond with you. Every fish, every fillet, every scallop is hand-selected and inspected by our experts. We partner with responsible, sustainable fisheries that share our commitment to preserving the health of our oceans for future generations.
                </p>
            </motion.section>

            {/* Card 3: Our Mission */}
            <motion.section 
              custom={2} // 3rd item (delayed more)
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-xl bg-card-light dark:bg-card-dark p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            >
                <h2 className="mb-3 text-2xl font-bold leading-tight tracking-[-0.015em] text-primary">Our Mission</h2>
                <p className="text-sm font-normal leading-relaxed text-primary-dark/80 dark:text-gray-300 flex-grow">
                 Our mission is to make exceptional seafood accessible to everyone. We aim to revolutionize the seafood industry by championing transparency, sustainability, and quality. We believe in fostering a community that appreciates the journey of their food.
                </p>
            </motion.section>

          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card-light/90 dark:bg-card-dark/90 backdrop-blur-lg border-t border-secondary-teal/20 dark:border-white/10 flex justify-around items-center z-50">
          <Link href="/" className="flex flex-col items-center justify-center text-primary-medium dark:text-accent w-full gap-1 hover:opacity-80 transition-opacity">
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/shop" className="flex flex-col items-center justify-center text-secondary-teal dark:text-gray-400 w-full gap-1 hover:text-primary-medium transition-colors">
            <LayoutGrid className="w-6 h-6" />
            <span className="text-xs font-medium">Shop</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center justify-center text-secondary-teal dark:text-gray-400 w-full gap-1 hover:text-primary-medium transition-colors">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs font-medium">Cart</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center justify-center text-secondary-teal dark:text-gray-400 w-full gap-1 hover:text-primary-medium transition-colors">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Account</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}