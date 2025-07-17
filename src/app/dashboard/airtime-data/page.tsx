
'use client';
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { processPayment } from "@/ai/flows/payment-flow";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  provider: z.string({
    required_error: "Please select a provider.",
  }),
  topupType: z.string({
    required_error: "Please select a top-up type.",
  }),
  phoneNumber: z.string().min(9, {
    message: "Phone number must be at least 9 characters.",
  }).max(9, {
    message: "Phone number must be exactly 9 characters."
  }),
  amount: z.coerce.number().min(100, {
    message: "Amount must be at least 100.",
  }).optional(),
  paymentMethod: z.string({
    required_error: "Please select a payment method.",
  }),
});

export default function AirtimeDataPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "",
      topupType: "",
      phoneNumber: "",
      paymentMethod: "",
      amount: undefined,
    },
  });

  const topupType = form.watch("topupType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(topupType === 'data'){
        toast({
            variant: "destructive",
            title: "Feature not available",
            description: "Data bundle top-up is not yet implemented.",
        });
        return;
    }
    if(!values.amount) {
        toast({
            variant: "destructive",
            title: "Amount is required",
            description: "Please enter an amount for airtime top-up.",
        });
        return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await processPayment({
          phoneNumber: values.phoneNumber,
          amount: values.amount,
          paymentMethod: values.paymentMethod,
      });

      if (result.success) {
        toast({
          title: "Top-up initiated!",
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Top-up Failed",
          description: result.message,
        });
      }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: "Something went wrong. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airtime & Data Top-up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mtn">MTN</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="nexttel">Nexttel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topupType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top-up Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="airtime">Airtime</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 670000000" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormDescription>
                    Enter the 9-digit number to top-up (without country code).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {topupType === 'airtime' && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (XAF)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)} disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {topupType === 'data' && (
                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Data bundle selection will be available here soon.</p>
                    </CardContent>
                </Card>
            )}


            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mtn-momo">MTN MoMo</SelectItem>
                      <SelectItem value="orange-money">Orange Money</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Processing..." : "Top Up Now"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
