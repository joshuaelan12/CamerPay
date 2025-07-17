
'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm, zodResolver } from '@mantine/form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    initialValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
    validate: zodResolver(profileSchema),
  });

  React.useEffect(() => {
    if (user) {
      form.setValues({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(user, {
        displayName: values.displayName,
        // photoURL can be added here in the future
      });

      // Note: Updating phone number requires verification and is more complex.
      // For this example, we'll focus on updating the display name.
      // A full implementation would involve sending a verification code.

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Manage your personal information and contact details.</CardDescription>
      </CardHeader>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="Enter your name"
              disabled={isSubmitting}
              {...form.getInputProps('displayName')}
            />
            {form.errors.displayName && <p className="text-sm font-medium text-destructive">{form.errors.displayName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              disabled
              {...form.getInputProps('email')}
            />
             <p className="text-sm text-muted-foreground">Your email address cannot be changed.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g., 670000000"
              disabled={isSubmitting}
              {...form.getInputProps('phoneNumber')}
            />
             <p className="text-sm text-muted-foreground">Note: A full implementation for phone number updates requires SMS verification.</p>
             {form.errors.phoneNumber && <p className="text-sm font-medium text-destructive">{form.errors.phoneNumber}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting || !form.isDirty()}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Saving...' : 'Update Profile'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
