
'use client';
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CreditCard,
  History,
  User,
  HelpCircle,
  LogOut,
  Phone,
  LayoutDashboard,
  ChevronDown,
  Zap,
  Droplets,
  Tv,
  Wifi,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isPayBillsOpen, setIsPayBillsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    const isPayBillsPath = pathname.startsWith('/dashboard/pay-bills');
    if(isPayBillsPath) {
        setIsPayBillsOpen(true);
    }
  }, [pathname]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }
  
  if (!user) {
    return null; // Don't render anything while redirecting
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/airtime-data', label: 'Airtime & Data', icon: Phone },
    { href: '/dashboard/history', label: 'Transaction History', icon: History },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
    { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
  ];

  const payBillsItems = [
      { href: '/dashboard/pay-bills?category=electricity', label: 'Electricity', icon: Zap },
      { href: '/dashboard/pay-bills?category=water', label: 'Water', icon: Droplets },
      { href: '/dashboard/pay-bills?category=tv', label: 'TV', icon: Tv },
      { href: '/dashboard/pay-bills?category=internet', label: 'Internet', icon: Wifi },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Image src="https://sdmntpraustraliaeast.oaiusercontent.com/files/00000000-4234-61fa-a3ae-41bb358dfb59/raw?se=2025-07-17T12%3A58%3A11Z&sp=r&sv=2024-08-04&sr=b&scid=f90c823e-4c67-5c14-bf33-887a3053545c&skoid=f71d6506-3cac-498e-b62a-67f9228033a9&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-17T04%3A22%3A28Z&ske=2025-07-18T04%3A22%3A28Z&sks=b&skv=2024-08-04&sig=K6MwvCkHMjaG9mCChVJTOjrVaRtZ7am41bNrVZgq1CM%3D" alt="CamerPay Logo" width={30} height={30} />
                <span className="font-bold text-lg text-primary">CamerPay</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.slice(0, 1).map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href} className="w-full">
                    <SidebarMenuButton isActive={pathname === item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}

            <Collapsible open={isPayBillsOpen} onOpenChange={setIsPayBillsOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <CreditCard className="h-5 w-5" />
                        <span>Pay Bills</span>
                        <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${isPayBillsOpen ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                  <SidebarMenuSub>
                      {payBillsItems.map((item) => (
                          <SidebarMenuSubItem key={item.href}>
                              <Link href={item.href} legacyBehavior passHref>
                                <SidebarMenuSubButton asChild isActive={typeof window !== 'undefined' && pathname + window.location.search === item.href}>
                                  <a>
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </Link>
                          </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
            
            {navItems.slice(1).map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton isActive={pathname === item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.photoURL || ''} alt="@user" />
              <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-sm font-medium truncate">{user?.displayName || user?.email}</p>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="md:hidden" />
              {/* You can add a header title here if needed */}
            </div>
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
