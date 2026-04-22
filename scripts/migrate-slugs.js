const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  const Product = mongoose.connection.collection('products');
  const products = await Product.find({
    $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }]
  }).toArray();
  
  console.log(`Products without slug: ${products.length}`);
  
  for (const p of products) {
    let slug = p.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let finalSlug = slug;
    let counter = 1;
    
    while (await Product.findOne({ slug: finalSlug, _id: { $ne: p._id } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    
    await Product.updateOne({ _id: p._id }, { $set: { slug: finalSlug } });
    console.log(`  ${p.name} -> ${finalSlug}`);
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
