"use client";
import {
  BanknoteIcon,
  BusIcon,
  CoinsIcon,
  DropletIcon,
  Home,
  User2Icon,
  UsersIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
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
  {
    title: "Keluarga",
    url: "/keluarga",
    icon: UsersIcon,
  },
  {
    title: "Riwayat Penyakit",
    url: "/riwayat-penyakit",
    icon: DropletIcon,
  },
  {
    title: "Tagihan",
    url: "/tagihan",
    icon: BanknoteIcon,
  },
  {
    title: "Jemputan",
    url: "/jemputan",
    icon: BusIcon,
  },
  {
    title: "Transaksi",
    url: "/transaksi",
    icon: CoinsIcon,
    children: [
      {
        title: "Tagihan",
        url: "/transaksi-tagihan",
      },
      {
        title: "Tagihan Lainnya",
        url: "/transaksi-uang-pangkal",
      },
    ],
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
                      `py-5 flex gap-2 transition-all duration-300 hover:bg-primary/80 hover:text-white`,
                      isActive(pathname, item.url) && "bg-primary text-white"
                    )}
                  >
                    {item.children ? (
                      <div>
                        <item.icon />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <SidebarTrigger asChild className="flex justify-start">
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarTrigger>
                    )}
                  </SidebarMenuButton>
                  {item.children &&
                    item.children.map((child) => (
                      <SidebarMenuSub key={child.url} className="mt-3">
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              `py-5 flex gap-2 transition-all duration-300 hover:bg-primary/80 hover:text-white`,
                              isActive(pathname, child.url) &&
                                "bg-primary/90 text-white"
                            )}
                          >
                            <Link href={child.url}>
                              <span>{child.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    ))}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
