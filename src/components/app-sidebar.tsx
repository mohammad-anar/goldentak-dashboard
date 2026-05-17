"use client";

import * as React from "react";
import {
  IconDashboard,
  IconCalendar,
  IconUsers,
  IconBell,
  IconCreditCard,
  IconLanguage,
  IconApi,
  IconTrophy,
  IconLogout,
  IconAdjustments,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Current Login Users",
    url: "/dashboard/current-login-users",
    icon: IconUsers,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: IconBell,
  },
  {
    title: "Subscriptions",
    url: "/dashboard/subscriptions",
    icon: IconCreditCard,
  },
  {
    title: "Languages",
    url: "/dashboard/languages",
    icon: IconLanguage,
  },
  {
    title: "API Management",
    url: "/dashboard/api",
    icon: IconApi,
  },
  {
    title: "Algorithm",
    url: "/dashboard/algorithm",
    icon: IconAdjustments,
  },
  {
    title: "Race Results",
    url: "/dashboard/race-results",
    icon: IconTrophy,
  },
  {
    title: "Subscription Plans",
    url: "/dashboard/subscription-plan",
    icon: IconCreditCard,
  },
];


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" className="bg-[#0b0e14] border-r-0" {...props}>
      <SidebarHeader className="bg-[#0b0e14] pt-8">
        <div className="flex justify-center mb-6">
          <Link href="/dashboard">
            <Image src={logo} alt="Which Win Logo" width={160} height={80} className="object-contain" />
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-[#0b0e14] px-4">
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`
                    flex items-center gap-3 px-4 py-6 rounded-lg transition-all duration-200
                    ${isActive 
                      ? "bg-[#006841] text-white hover:bg-[#006841]/90" 
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-white"}
                  `}
                >
                  <Link href={item.url}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-[15px]">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="bg-[#0b0e14] p-4 border-t border-gray-800/50">
        <div className="mb-6">
          <Button 
            variant="destructive" 
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-6 font-semibold"
          >
            <IconLogout className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
        
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-10 w-10 border border-gray-700">
            <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
            <AvatarFallback className="bg-gray-800 text-white">AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden text-left">
            <span className="text-sm font-semibold text-white truncate">admin@whichwin.app</span>
            <span className="text-xs text-gray-400 truncate">Admin</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
