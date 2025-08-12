/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AuthService from "@/services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Input } from "antd";
import { useState } from "react";
import { toast } from "sonner";

function ProfilePage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorNewPassword, setErrorNewPassword] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");

  const handleChangeNewPassword = (e: any) => {
    const value = e.target.value;
    setNewPassword(value);

    if (value.length < 6) {
      setErrorNewPassword("Password minimal 6 karakter");
    } else {
      setErrorNewPassword("");
    }

    if (confirmPassword && confirmPassword !== value) {
      setErrorConfirm("Konfirmasi password tidak sama");
    } else {
      setErrorConfirm("");
    }
  };

  const handleChangeConfirmPassword = (e: any) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== newPassword) {
      setErrorConfirm("Konfirmasi password tidak sama");
    } else {
      setErrorConfirm("");
    }
  };

  const handleSubmit = async () => {
    try {
      await AuthService.updatePassword({
        password: newPassword,
        confirm_password: confirmPassword,
      });
      setConfirmPassword("");
      setNewPassword("");
      toast("Password anda berhasil diperbarui");
    } catch (error: any) {
      console.error("Error update password");
    }
  };

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

      <div className="space-y-3">
        <p className="font-medium">Ganti Password</p>
        <div className="space-y-1">
          <label className="text-xs">Password Baru</label>
          <Input.Password
            placeholder="Password Baru"
            value={newPassword}
            onChange={handleChangeNewPassword}
          />
          {errorNewPassword && (
            <p className="text-red-500 text-xs">{errorNewPassword}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs">Konfirmasi Password Baru</label>
          <Input.Password
            placeholder="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
          />
          {errorConfirm && (
            <p className="text-red-500 text-xs">{errorConfirm}</p>
          )}
        </div>

        <Button
          disabled={Boolean(
            errorNewPassword || errorConfirm || !confirmPassword || !newPassword
          )}
          type="primary"
          onClick={handleSubmit}
        >
          Ganti Password
        </Button>
      </div>
    </div>
  );
}

export default ProfilePage;
