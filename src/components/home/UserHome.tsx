'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, Waves, Fish, Shell, Anchor, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/images/UserHome.png';

const categories = [
  { name: 'Fish', icon: Fish, color: 'from-blue-500 to-blue-600' },
  { name: 'Prawns', icon: Shell, color: 'from-orange-400 to-orange-500' },
  { name: 'Crab', icon: Anchor, color: 'from-red-400 to-red-500' },
  { name: 'Lobster', icon: Star, color: 'from-purple-400 to-purple-500' },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function UserHome() {
  return (
    <div className="bg-aq-surface min-h-screen">
      {/* ===== Hero Section ===== */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-52 md:h-[400px] lg:h-[480px]">
          <Image
            src={heroImage}
            alt="Fresh seafood"
            fill
            className="object-cover"
            priority
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-aq-surface" />
          {/* Hero overlay content */}
          <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-16 px-4">
            <div className="text-center max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2"
              >
                Welcome to AquaCart
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-sm md:text-base text-white/80 drop-shadow-md"
              >
                Discover premium seafood, delivered fresh today
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      <div className="container -mt-6 relative z-10">
        {/* ===== Search Bar ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <Link href="/shop" className="block">
            <div className="flex items-center gap-3 h-12 px-5 rounded-full bg-white shadow-aq-md hover:shadow-aq-hover transition-shadow duration-300 cursor-pointer">
              <Search className="w-5 h-5 text-aq-outline" />
              <span className="text-sm text-aq-outline">Search for fresh seafood...</span>
            </div>
          </Link>
        </motion.div>

        {/* ===== Popular Categories ===== */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-aq-on-surface">Popular Categories</h2>
            <Link
              href="/shop"
              className="text-xs font-semibold text-aq-primary flex items-center gap-1 hover:gap-2 transition-all"
            >
              See All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={fadeInUp}>
                <Link
                  href="/shop"
                  className="flex flex-col items-center gap-2 min-w-[76px] group"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-aq-sm group-hover:shadow-aq-hover group-hover:scale-105 transition-all duration-300`}
                  >
                    <cat.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-medium text-aq-on-surface-variant group-hover:text-aq-on-surface transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ===== Promo Banner ===== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link href="/shop">
            <div className="relative rounded-2xl bg-aq-gradient-primary overflow-hidden p-6 md:p-10 group cursor-pointer">
              {/* Decorative */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -left-6 w-28 h-28 rounded-full bg-white/5" />

              <div className="relative z-10 max-w-sm">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
                  🔥 Today&apos;s Deal
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2">
                  Fresh Catch of the Day
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  Get 20% off on premium wild-caught salmon. Limited time offer.
                </p>
                <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-aq-primary text-sm font-bold group-hover:shadow-lg transition-shadow duration-300">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* ===== Our Story / Quality / Mission ===== */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Our Story',
              text: 'Founded by a family of fishermen with generations of experience, AquaCart began with a simple mission: to bring the freshest, highest-quality seafood directly from the ocean to your table.',
              icon: Waves,
              color: 'bg-aq-primary-fixed text-aq-primary',
            },
            {
              title: 'Quality Promise',
              text: 'Every fish, every fillet, every scallop is hand-selected and inspected by our experts. We partner with responsible, sustainable fisheries that share our commitment.',
              icon: Star,
              color: 'bg-emerald-50 text-aq-tertiary',
            },
            {
              title: 'Our Mission',
              text: 'To make exceptional seafood accessible to everyone. We aim to revolutionize the seafood industry by championing transparency, sustainability, and quality.',
              icon: Anchor,
              color: 'bg-amber-50 text-amber-600',
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeInUp}
              className="aq-card p-6 group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-aq-on-surface mb-2">{card.title}</h3>
              <p className="text-sm text-aq-on-surface-variant leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </div>
  );
}