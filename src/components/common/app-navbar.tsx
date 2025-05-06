"use client";

import { Avatar, Dropdown } from "antd";
import Cookies from "js-cookie";
import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import AuthService from "@/services/auth/auth.service";

function AppNavbar() {
  const handleLogout = () => {
    Cookies.remove("session");
    window.location.href = "/login";
  };

  const { data: me } = useQuery({
    queryKey: ["ME"],
    queryFn: async () => {
      const response = await AuthService.me({});
      return response;
    },
  });

  return (
    <nav className="h-12 w-full border-b flex justify-between items-center pr-4">
      <SidebarTrigger />

      <div className="flex items-center gap-2">
        <Avatar src="/images/avatar.png" />

        <Dropdown
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="!min-w-[120px] !max-w-[120px]"
          menu={{
            style: {
              borderRadius: "12px",
              padding: "0px",
              overflow: "hidden",
            },
            items: [
              {
                key: "1",
                style: {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  borderRadius: 0,
                },
                label: (
                  <Link type="next-link" href="/profile" passHref>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <UserIcon className="w-5 h-5" />
                      Profile
                    </div>
                  </Link>
                ),
              },
              {
                key: "2",
                style: {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  borderRadius: 0,
                },
                label: (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <LogOutIcon className="w-5 h-5" />
                    Log out
                  </div>
                ),
                danger: true,
                onClick: handleLogout,
              },
            ],
          }}
        >
          <div className="flex items-center gap-1 cursor-pointer">
            <p>{me?.data.nama}</p>
            <ChevronDownIcon />
          </div>
        </Dropdown>
      </div>
    </nav>
  );
}

export default AppNavbar;
