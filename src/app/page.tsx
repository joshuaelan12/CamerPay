'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Image src="https://firebasestudio.app/assets/images/CamerPay/125861b3-469f-43b9-a417-184065671151.png" alt="CamerPay Logo" width={40} height={40} />
            <h1 className="text-2xl font-bold text-primary">CamerPay</h1>
        </div>
        <div>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="ml-2">Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Welcome to CamerPay</CardTitle>
            <CardDescription className="text-xl text-muted-foreground mt-2">
              The simplest way to pay your bills in Cameroon.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="max-w-2xl mb-6">
              Tired of long queues and complicated payment processes? CamerPay brings all your bill payments into one place. Pay for electricity, water, TV subscriptions, and top up your airtime and data instantly and securely.
            </p>
            <Image src="https://placehold.co/600x400.png" alt="Happy people using mobile payment" width={600} height={400} className="rounded-lg mb-6" data-ai-hint="mobile payment" />
            <Link href="/signup">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
