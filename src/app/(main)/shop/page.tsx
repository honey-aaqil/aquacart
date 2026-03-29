import { ProductCard } from '@/components/products/ProductCard';
import dbConnect from '@/lib/mongodb';
import ProductModel, { SerializedProduct } from '@/models/Product';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';

async function getProducts() {
  await dbConnect();
  const products = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products)) as SerializedProduct[];
}

export default async function ShopPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const products = await getProducts();

  // Get unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="bg-aq-surface min-h-screen">
      {/* Hero Banner */}
      <section className="bg-aq-gradient-primary py-10 md:py-16 px-4" id="shop-hero">
        <div className="container text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Our Freshest Catch
          </h1>
          <p className="text-sm md:text-base text-white/70 mb-6">
            Premium quality aquatic products, delivered right to your door.
          </p>
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aq-outline" />
            <input
              type="text"
              placeholder="Search seafood..."
              className="w-full h-12 pl-12 pr-4 rounded-full bg-white/95 shadow-aq-lg text-sm text-aq-on-surface placeholder:text-aq-outline focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </section>

      <div className="container py-6 md:py-10">
        {/* Category filter chips */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-4 mb-2" id="category-filters">
            <span className="aq-badge bg-aq-primary text-white px-4 py-1.5 text-xs shrink-0 cursor-pointer">
              All
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="aq-badge bg-aq-surface-container-lowest text-aq-on-surface-variant px-4 py-1.5 text-xs shrink-0 cursor-pointer hover:bg-aq-primary-fixed hover:text-aq-primary transition-colors duration-200 shadow-aq-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20" id="no-products">
            <div className="w-16 h-16 rounded-2xl bg-aq-surface-container mx-auto flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-8 h-8 text-aq-outline" />
            </div>
            <p className="text-aq-on-surface-variant font-medium">
              No products found. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6" id="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}