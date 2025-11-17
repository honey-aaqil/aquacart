'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IProduct } from '@/models/Product';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ProductCardProps = {
  product: IProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      if (!res.ok) {
        throw new Error('Failed to add to cart');
      }

      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem adding the item to your cart.',
      });
    } finally {
      setIsAdding(false);
    }
  };


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
      <Card className="w-full h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <Link href={`/shop/${product._id}`} className="block">
          <CardHeader className="p-0">
            <motion.div layoutId={`product-image-${product._id}`}>
              <Image
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
                height={300}
                src={product.imageUrl}
                width={400}
                data-ai-hint={product.imageHint}
              />
            </motion.div>
          </CardHeader>
        </Link>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start">
            <Badge variant="outline">{product.category}</Badge>
            <Badge variant={product.availability ? "secondary" : "destructive"}>
                {product.availability ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
          <Link href={`/shop/${product._id}`} className="block">
            <CardTitle className="mt-4 text-lg font-bold hover:text-primary transition-colors">{product.name}</CardTitle>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="text-xl font-extrabold text-primary">${product.price.toFixed(2)}</p>
          <Button onClick={handleAddToCart} disabled={!product.availability || isAdding} size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
