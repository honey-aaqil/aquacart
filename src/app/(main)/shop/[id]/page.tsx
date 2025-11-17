'use client';

import { IProduct } from '@/models/Product';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) throw new Error('Product not found');
          const data = await res.json();
          setProduct(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

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
        body: JSON.stringify({ productId: product?._id, quantity }),
      });

      if (!res.ok) {
        throw new Error('Failed to add to cart');
      }

      toast({
        title: 'Added to Cart',
        description: `${quantity} x ${product?.name} added to your cart.`,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <motion.div layoutId={`product-image-${id}`} className="rounded-lg overflow-hidden shadow-lg">
          <Image
            alt={product.name}
            className="aspect-square object-cover w-full"
            height={600}
            src={product.imageUrl}
            width={600}
            data-ai-hint={product.imageHint}
          />
        </motion.div>
        <div className="flex flex-col h-full">
          <Badge variant="outline" className="w-fit">{product.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mt-4 text-base">{product.description}</p>
          
          <div className="mt-6">
            <Badge variant={product.availability ? "secondary" : "destructive"}>
                {product.availability ? `${product.quantity} in stock` : 'Out of Stock'}
            </Badge>
          </div>

          <div className="mt-auto pt-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-md border p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleAddToCart} disabled={!product.availability || isAdding} size="lg" className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
