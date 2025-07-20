
'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Droplets, Tv, Wifi, Smartphone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const billCategories = [
  { name: "Electricity", icon: Zap, path: "/dashboard/pay-bills?category=electricity" },
  { name: "Water", icon: Droplets, path: "/dashboard/pay-bills?category=water" },
  { name: "TV", icon: Tv, path: "/dashboard/pay-bills?category=tv" },
  { name: "Internet", icon: Wifi, path: "/dashboard/pay-bills?category=internet" },
  { name: "Airtime & Data", icon: Smartphone, path: "/dashboard/airtime-data" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 md:p-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.displayName || user?.email}!</h1>
        <p className="text-muted-foreground">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {billCategories.map((category) => (
          <Link href={category.path} key={category.name} className="no-underline">
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
              <CardHeader className="flex-grow">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <category.icon className="w-8 h-8 text-primary" />
                    <span className="text-xl">{category.name}</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Click here to pay your {category.name.toLowerCase()} bill or top-up.</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
