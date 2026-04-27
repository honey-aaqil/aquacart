'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Client-side validation schema (mirrors the API schema)
const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be at most 50 characters' })
    .trim(),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, {
      message: 'Invalid phone number. Use international format, e.g. +15551234',
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditorProps {
  defaultValues: {
    name: string;
    phone: string;
  };
}

export default function ProfileEditor({ defaultValues }: ProfileEditorProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle field-level validation errors from the API
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ');
          toast({
            title: 'Validation Error',
            description: errorMessages,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.message || 'Failed to update profile',
            variant: 'destructive',
          });
        }
        return;
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });

      setOpen(false);

      // Refresh the server component data so the new name reflects immediately
      router.refresh();
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form values when dialog opens
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      reset(defaultValues);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl border-aq-outline/30 text-aq-on-surface-variant hover:bg-aq-surface-container hover:text-aq-primary transition-all"
          id="edit-profile-btn"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-aq-surface border-aq-outline/20 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-aq-on-surface font-extrabold text-xl">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-aq-on-surface-variant">
            Update your personal information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-name" className="text-aq-on-surface font-semibold">
              Full Name
            </Label>
            <Input
              id="profile-name"
              placeholder="John Doe"
              {...register('name')}
              className={`rounded-xl bg-aq-surface-container border-aq-outline/30 text-aq-on-surface placeholder:text-aq-outline focus-visible:ring-aq-primary ${
                errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-0.5">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-phone" className="text-aq-on-surface font-semibold">
              Phone Number
            </Label>
            <Input
              id="profile-phone"
              placeholder="+15551234567"
              {...register('phone')}
              className={`rounded-xl bg-aq-surface-container border-aq-outline/30 text-aq-on-surface placeholder:text-aq-outline focus-visible:ring-aq-primary ${
                errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-0.5">{errors.phone.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-aq-gradient-primary text-white font-bold h-11 shadow-aq-sm hover:shadow-aq-md transition-all"
            id="save-profile-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
