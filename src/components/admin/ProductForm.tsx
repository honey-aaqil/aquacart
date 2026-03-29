'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { SerializedProduct } from '@/models/Product';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(0.01, { message: 'Price must be greater than 0.' }),
  pricePerKg: z.coerce.number().min(0, { message: 'Price per Kg cannot be negative.' }),
  category: z.string().min(1, { message: 'Please select or enter a category.' }),
  quantity: z.coerce.number().min(0, { message: 'Quantity cannot be negative.' }),
  stockKg: z.coerce.number().min(0, { message: 'Weight (Kg) cannot be negative.' }),
  image: z.any().optional(), // File validation is handled manually inside onSubmit
});

type ProductFormProps = {
  initialData?: SerializedProduct | null;
  onSuccess: () => void;
};

export default function ProductForm({ onSuccess, initialData }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEdit = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      pricePerKg: initialData?.pricePerKg || 0,
      category: initialData?.category || '',
      quantity: initialData?.quantity || 1,
      stockKg: initialData?.stockKg || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price.toString());
      formData.append('pricePerKg', values.pricePerKg.toString());
      formData.append('category', values.category);
      formData.append('quantity', values.quantity.toString());
      formData.append('stockKg', values.stockKg.toString());

      if (values.image && values.image.length > 0) {
        formData.append('image', values.image[0]);
      } else if (!isEdit) {
        throw new Error('An image file is required to create a new product.');
      }

      const url = isEdit ? `/api/products/${initialData._id}` : '/api/products';
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: formData, // the browser sets Content-Type to multipart/form-data automatically
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast({
        title: 'Success',
        description: isEdit ? 'Product updated successfully.' : 'Product created successfully.',
      });
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Fresh Salmon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price/Piece ($)</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
            control={form.control}
            name="pricePerKg"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price/Kg ($)</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Fish">Fish</SelectItem>
                    <SelectItem value="Shellfish">Shellfish</SelectItem>
                    <SelectItem value="Fillet">Fillet</SelectItem>
                    <SelectItem value="Whole">Whole</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Stock (Pieces)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stockKg"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Stock (Kg)</FormLabel>
                <FormControl>
                    <Input type="number" step="0.1" placeholder="0.0" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Product Image {isEdit && <span className="text-muted-foreground font-normal">(Leave empty to keep current)</span>}</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => onChange(e.target.files)} 
                  {...fieldProps} 
                />
              </FormControl>
              {!isEdit && (
                <FormDescription className="text-xs">
                  Upload a high-quality product image.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the product..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Product' : 'Create Product')}
        </Button>
      </form>
    </Form>
  );
}