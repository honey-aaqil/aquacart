import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import ProductModel from '@/models/Product';
import UserModel from '@/models/User';
import { PlaceHolderImages } from './placeholder-images';
import { ROLES } from './constants';

const seedProducts = [
  { name: 'Wild Alaskan Salmon', description: 'Rich in omega-3s, vibrant color, and firm texture. Perfect for grilling or baking.', price: 29.99, category: 'Fish', quantity: 50 },
  { name: 'Fresh Atlantic Cod', description: 'Mild, flaky white fish. Excellent for fish and chips, or a light, healthy meal.', price: 18.50, category: 'Fish', quantity: 80 },
  { name: 'Jumbo Black Tiger Shrimp', description: 'Large, flavorful shrimp with a firm, snappy texture. Great for scampi or grilling.', price: 24.00, category: 'Shellfish', quantity: 120 },
  { name: 'Bluefin Tuna Steaks', description: 'Premium, sushi-grade tuna steaks. Deep red, rich, and buttery.', price: 45.00, category: 'Fish', quantity: 30 },
  { name: 'Live Maine Lobster', description: 'Sweet and succulent meat. A true delicacy for special occasions.', price: 35.75, category: 'Shellfish', quantity: 40 },
  { name: 'Fresh Sea Scallops', description: 'Large, sweet, and tender sea scallops. Perfect for searing to a golden brown.', price: 32.00, category: 'Shellfish', quantity: 60 },
  { name: 'Pacific Oysters', description: 'A dozen fresh, briny oysters from the Pacific coast. Served best on the half shell.', price: 22.00, category: 'Shellfish', quantity: 100 },
  { name: 'Swordfish Steaks', description: 'Meaty and firm with a mildly sweet flavor. An excellent choice for the grill.', price: 26.50, category: 'Fish', quantity: 45 },
];

async function seedDatabase() {
  try {
    await dbConnect();

    console.log('Clearing existing data...');
    await ProductModel.deleteMany({});
    // This is the fix: delete all users, not just the admin
    await UserModel.deleteMany({});

    console.log('Seeding products...');
    const productsWithImages = seedProducts.map((p, index) => {
        const placeholder = PlaceHolderImages[index % PlaceHolderImages.length];
        return {
            ...p,
            slug: p.name.toLowerCase().replace(/\s+/g, '-'),
            imageUrl: placeholder.imageUrl,
            imageHint: placeholder.imageHint,
            availability: p.quantity > 0,
        };
    });

    await ProductModel.insertMany(productsWithImages);
    console.log(`${productsWithImages.length} products have been seeded.`);

    console.log('Seeding admin user...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new UserModel({
      name: 'Admin User',
      email: 'admin@gmail.com',
      phone: '+15550001111',
      password: hashedPassword,
      role: ROLES.ADMIN,
      isEmailVerified: true,
    });
    await adminUser.save();
    console.log('Admin user seeded with email: admin@gmail.com and password: "password123" (or your ADMIN_PASSWORD env var)');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();