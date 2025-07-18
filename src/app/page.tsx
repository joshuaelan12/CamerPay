
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function WelcomePage() {
  const logoSrc = "https://drive.google.com/uc?export=view&id=1SxpdoB-VAhsPRrHTxDss0ybiFYCEbZSf";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Image src={logoSrc} alt="CamerPay Logo" width={40} height={40} />
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
            <Image src={logoSrc} alt="CamerPay Logo" width={150} height={150} className="rounded-lg mb-6" />
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
