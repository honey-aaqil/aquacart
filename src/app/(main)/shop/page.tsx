import { ProductCard } from '@/components/products/ProductCard';
import dbConnect from '@/lib/mongodb';
// FIX: Import SerializedProduct instead of (or in addition to) IProduct
import ProductModel, { SerializedProduct } from '@/models/Product';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function getProducts() {
  await dbConnect();
  const products = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
  
  // FIX: Cast the result to SerializedProduct[]
  // This tells TypeScript: "Trust me, this is now the JSON version with string IDs"
  return JSON.parse(JSON.stringify(products)) as SerializedProduct[];
}

export default async function ShopPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const products = await getProducts();

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
          Our Freshest Catch
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Premium quality aquatic products, delivered right to your door.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            No products found. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            // product._id is now correctly typed as string because of the cast above
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}