import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { auth } from '@/lib/auth';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// POST: Migrate existing products to have slugs
export async function POST() {
  try {
    // Only admins can run migrations
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find all products without a slug
    const productsWithoutSlug = await ProductModel.find({ $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }] });

    if (productsWithoutSlug.length === 0) {
      return NextResponse.json({ message: 'All products already have slugs.', migrated: 0 }, { status: 200 });
    }

    const results: { name: string; slug: string }[] = [];

    for (const product of productsWithoutSlug) {
      let baseSlug = generateSlug(product.name);
      let slug = baseSlug;
      let counter = 1;

      // Ensure uniqueness
      while (await ProductModel.findOne({ slug, _id: { $ne: product._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      product.slug = slug;
      await product.save();
      results.push({ name: product.name, slug });
    }

    return NextResponse.json({
      message: `Successfully migrated ${results.length} product(s).`,
      migrated: results.length,
      products: results,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Migration failed:', error);
    return NextResponse.json({ message: error.message || 'Migration failed' }, { status: 500 });
  }
}
