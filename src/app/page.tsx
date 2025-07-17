
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function WelcomePage() {
  const logoSrc = "https://sdmntpraustraliaeast.oaiusercontent.com/files/00000000-4234-61fa-a3ae-41bb358dfb59/raw?se=2025-07-17T12%3A58%3A11Z&sp=r&sv=2024-08-04&sr=b&scid=f90c823e-4c67-5c14-bf33-887a3053545c&skoid=f71d6506-3cac-498e-b62a-67f9228033a9&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-17T04%3A22%3A28Z&ske=2025-07-18T04%3A22%3A28Z&sks=b&skv=2024-08-04&sig=K6MwvCkHMjaG9mCChVJTOjrVaRtZ7am41bNrVZgq1CM%3D";

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
