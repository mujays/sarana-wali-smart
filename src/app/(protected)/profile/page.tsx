"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AuthService from "@/services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";

function ProfilePage() {
  const { data: me } = useQuery({
    queryKey: ["ME"],
    queryFn: async () => {
      const response = await AuthService.me({});
      return response;
    },
  });

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Home",
              url: "/",
            },
            {
              title: "Profile",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Profile</p>
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs">Nama</label>
          <Input placeholder="Nama" disabled value={me?.data.nama} />
        </div>
        <div className="space-y-1">
          <label className="text-xs">Email</label>
          <Input placeholder="Email" disabled value={me?.data.email} />
        </div>
        <div className="space-y-1">
          <label className="text-xs">No HP</label>
          <Input placeholder="No HP" disabled value={me?.data.no_hp} />
        </div>
        <div className="space-y-1">
          <label className="text-xs">Pekerjaan</label>
          <Input
            placeholder="Pekerjaan"
            disabled
            value={me?.data.pekerjaan || "-"}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
