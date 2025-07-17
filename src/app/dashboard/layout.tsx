
'use client';
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
  LayoutDashboard
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
    { href: '/dashboard/pay-bills', label: 'Pay Bills', icon: CreditCard },
    { href: '/dashboard/airtime-data', label: 'Airtime & Data', icon: Phone },
    { href: '/dashboard/history', label: 'Transaction History', icon: History },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
    { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Image src="https://placehold.co/40x40.png" alt="CamerPay Logo" width={30} height={30} data-ai-hint="logo" />
                <span className="font-bold text-lg text-primary">CamerPay</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
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
