'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Home, Loader2, MoreVertical, Plus, Star, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { IAddress } from '@/models/User';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddressManager({ initialAddresses }: { initialAddresses: IAddress[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { street: '', city: '', state: '', zipCode: '' },
  });

  const onSubmit = async (values: AddressFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to save address');
      const updatedAddresses = await res.json();
      setAddresses(updatedAddresses);
      toast({ title: 'Success', description: 'Address added successfully.' });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save address.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (action: 'delete' | 'setDefault', addressId: string) => {
    try {
        const res = await fetch('/api/account/addresses', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addressId, action }),
        });
        if (!res.ok) throw new Error(`Failed to ${action} address`);
        const updatedAddresses = await res.json();
        setAddresses(updatedAddresses);
        toast({ title: 'Success', description: `Address ${action === 'delete' ? 'deleted' : 'updated'}.` });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: `Could not ${action} address.` });
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Your Addresses</CardTitle>
            <CardDescription>Manage your shipping addresses.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new address</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="street" render={({ field }) => (
                  <FormItem><FormLabel>Street</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="zipCode" render={({ field }) => (
                  <FormItem><FormLabel>ZIP / Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Address
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div key={addr._id} className="flex items-center rounded-md border p-4">
                <Home className="h-6 w-6 mr-4 text-muted-foreground"/>
                <div className="flex-grow">
                    <p className="font-medium">
                        {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                    </p>
                    {addr.isDefault && (
                        <div className="text-xs font-semibold text-accent flex items-center mt-1">
                            <Star className="h-3 w-3 mr-1 fill-current" /> Default
                        </div>
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {!addr.isDefault && (
                            <DropdownMenuItem onSelect={() => handleAction('setDefault', addr._id)}>
                                <Star className="mr-2 h-4 w-4"/> Set as Default
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onSelect={() => handleAction('delete', addr._id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">You have no saved addresses.</p>
        )}
      </CardContent>
    </Card>
  );
}
