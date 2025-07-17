
'use client';

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

const formSchema = z.object({
  provider: z.string({
    required_error: "Please select a provider.",
  }),
  topupType: z.string({
    required_error: "Please select a top-up type.",
  }),
  phoneNumber: z.string().min(9, {
    message: "Phone number must be at least 9 characters.",
  }).max(15, {
    message: "Phone number must not be longer than 15 characters."
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const topupType = form.watch("topupType");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Top-up initiated!",
      description: "Your request is being processed.",
    });
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </Trigger>
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
                    <Input placeholder="e.g., 670000000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the number to top-up.
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
                      <Input type="number" placeholder="Enter amount" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </Trigger>
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

            <Button type="submit" className="w-full md:w-auto">Top Up Now</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
