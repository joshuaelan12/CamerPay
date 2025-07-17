
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { processPayment } from '@/ai/flows/payment-flow';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const eneoFormSchema = z.object({
  meterNumber: z.string().min(1, { message: 'Meter number is required.' }),
  amount: z.coerce.number().min(100, { message: 'Amount must be at least 100.' }),
  mobileWalletNumber: z.string().min(9, { message: 'Please enter a valid 9-digit phone number.' }).max(9, { message: 'Please enter a valid 9-digit phone number.' }),
  paymentFlow: z.enum(['direct', 'redirect'], {
    required_error: 'You need to select a payment method.',
  }),
});

const camwaterFormSchema = z.object({
  contractNumber: z.string().length(10, { message: 'Contract number must be 10 digits.' }),
  amount: z.coerce.number().min(100, { message: 'Amount must be at least 100.' }),
  mobileWalletNumber: z.string().min(9, { message: 'Please enter a valid 9-digit phone number.' }).max(9, { message: 'Please enter a valid 9-digit phone number.' }),
  paymentFlow: z.enum(['direct', 'redirect'], {
    required_error: 'You need to select a payment method.',
  }),
});

const tvSubscriptionFormSchema = z.object({
  subscriberNumber: z.string().min(1, { message: 'Subscriber number is required.' }),
  subscriptionPackage: z.string({ required_error: 'Please select a package.' }),
  amount: z.coerce.number(),
  mobileWalletNumber: z.string().min(9, { message: 'Please enter a valid 9-digit phone number.' }).max(9, { message: 'Please enter a valid 9-digit phone number.' }),
  paymentFlow: z.enum(['direct', 'redirect'], {
    required_error: 'You need to select a payment method.',
  }),
});

function EneoPaymentForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof eneoFormSchema>>({
    resolver: zodResolver(eneoFormSchema),
    defaultValues: {
      meterNumber: '',
      amount: undefined,
      mobileWalletNumber: user?.phoneNumber?.slice(-9) || '',
      paymentFlow: 'direct',
    },
  });

  async function onSubmit(values: z.infer<typeof eneoFormSchema>) {
    setIsSubmitting(true);
    try {
      const result = await processPayment({
        phoneNumber: values.mobileWalletNumber,
        amount: values.amount,
        paymentMethod: 'mtn-momo', // Assuming MTN for now, can be dynamic later
        paymentFlow: values.paymentFlow,
        memo: `ENEO bill for meter ${values.meterNumber}`,
      });

      if (result.success) {
        if (values.paymentFlow === 'redirect' && result.redirectUrl) {
           window.location.href = result.redirectUrl;
        } else {
          toast({
            title: 'Payment Initiated!',
            description: result.message,
          });
          form.reset();
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Payment Failed',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay ENEO Electricity Bill</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="meterNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meter Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your meter number" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (XAF)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter amount" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileWalletNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Wallet Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g., 670000000" {...field} disabled={isSubmitting}/>
                  </FormControl>
                   <FormDescription>
                    Enter the 9-digit number to be charged (without country code).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentFlow"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      disabled={isSubmitting}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="direct" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Direct Mobile Money Charge
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="redirect" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Web Redirect
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Processing...' : 'Pay Now'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function CamWaterPaymentForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
  
    const form = useForm<z.infer<typeof camwaterFormSchema>>({
      resolver: zodResolver(camwaterFormSchema),
      defaultValues: {
        contractNumber: '',
        amount: undefined,
        mobileWalletNumber: user?.phoneNumber?.slice(-9) || '',
        paymentFlow: 'direct',
      },
    });
  
    async function onSubmit(values: z.infer<typeof camwaterFormSchema>) {
      setIsSubmitting(true);
      try {
        const result = await processPayment({
          phoneNumber: values.mobileWalletNumber,
          amount: values.amount,
          paymentMethod: 'mtn-momo', // This can be dynamic later
          paymentFlow: values.paymentFlow,
          memo: `CamWater bill for contract ${values.contractNumber}`,
        });
  
        if (result.success) {
          if (values.paymentFlow === 'redirect' && result.redirectUrl) {
             window.location.href = result.redirectUrl;
          } else {
            toast({
              title: 'Payment Initiated!',
              description: result.message,
            });
            form.reset();
          }
        } else {
          toast({
            variant: 'destructive',
            title: 'Payment Failed',
            description: result.message,
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'An Error Occurred',
          description: 'Something went wrong. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pay CamWater Water Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="contractNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer ID/Contract Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your 10-digit contract number" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (XAF)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileWalletNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Wallet Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="e.g., 670000000" {...field} disabled={isSubmitting}/>
                    </FormControl>
                     <FormDescription>
                      Enter the 9-digit number to be charged (without country code).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentFlow"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={isSubmitting}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="direct" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Direct Mobile Money Charge
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="redirect" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Web Redirect
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Processing...' : 'Pay Now'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

function TvSubscriptionForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const subscriptionPackages = {
    daily: 250,
    weekly: 1000,
    monthly: 2500,
  };

  const form = useForm<z.infer<typeof tvSubscriptionFormSchema>>({
    resolver: zodResolver(tvSubscriptionFormSchema),
    defaultValues: {
      subscriberNumber: '',
      subscriptionPackage: '',
      amount: 0,
      mobileWalletNumber: user?.phoneNumber?.slice(-9) || '',
      paymentFlow: 'direct',
    },
  });

  const selectedPackage = form.watch('subscriptionPackage');

  React.useEffect(() => {
    if (selectedPackage && subscriptionPackages[selectedPackage as keyof typeof subscriptionPackages]) {
      form.setValue('amount', subscriptionPackages[selectedPackage as keyof typeof subscriptionPackages]);
    } else {
        form.setValue('amount', 0);
    }
  }, [selectedPackage, form]);


  async function onSubmit(values: z.infer<typeof tvSubscriptionFormSchema>) {
    setIsSubmitting(true);
    try {
      const result = await processPayment({
        phoneNumber: values.mobileWalletNumber,
        amount: values.amount,
        paymentMethod: 'mtn-momo',
        paymentFlow: values.paymentFlow,
        memo: `TV Subscription for ${values.subscriberNumber} (${values.subscriptionPackage})`,
      });

      if (result.success) {
        if (values.paymentFlow === 'redirect' && result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          toast({
            title: 'Subscription Initiated!',
            description: result.message,
          });
          form.reset();
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Subscription Failed',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>TV Subscription — Canal+ / MTN TV</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subscriberNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscriber Number / Account ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your subscriber number" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscriptionPackage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Package</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subscription package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily (250 FCFA)</SelectItem>
                      <SelectItem value="weekly">Weekly (1000 FCFA)</SelectItem>
                      <SelectItem value="monthly">Monthly (2500 FCFA)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (XAF)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} readOnly disabled={isSubmitting} className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileWalletNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Wallet Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g., 670000000" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    Enter the 9-digit number to be charged (without country code).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentFlow"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      disabled={isSubmitting}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="direct" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Direct Mobile Money Charge
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="redirect" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Web Redirect
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Processing...' : 'Subscribe Now'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


export default function PayBillsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  if (category === 'electricity') {
    return <EneoPaymentForm />;
  }
  
  if (category === 'water') {
    return <CamWaterPaymentForm />;
  }

  if (category === 'tv') {
    return <TvSubscriptionForm />;
  }

  // Default content or other categories can be handled here
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Select a bill category to get started.</p>
      </CardContent>
    </Card>
  );
}
