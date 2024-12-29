"use client";
import { Home, User2Icon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "./image";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Siswa",
    url: "/siswa",
    icon: User2Icon,
  },
];

const isActive = (pathname: string, item: string) => {
  if (item === "/" && pathname === "/") {
    return true;
  }

  if (item !== "/" && pathname.startsWith(item)) {
    return true;
  }

  return false;
};

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar className="bg-red-300">
      <SidebarContent>
        <SidebarHeader className="flex justify-center items-center">
          <div className="w-[180px] flex justify-center mt-4">
            <Image alt="logo" src="/images/logo-color.png" />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      `py-5 flex gap-2 transition-all duration-300 hover:bg-primary/50 hover:text-white`,
                      isActive(pathname, item.url) && "bg-primary text-white"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
