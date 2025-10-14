/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import AuthService from "@/services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Divider } from "antd";
import { useState } from "react";
import { toast } from "sonner";
import { EditProfileForm, UpdateEmailForm } from "./_components";

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

      {/* Edit Profile Form */}
      <EditProfileForm
        initialData={{
          nama: me?.data.nama,
          no_hp: me?.data.no_hp,
          pekerjaan: me?.data.pekerjaan,
        }}
      />

      <Divider />

      {/* Update Email Form */}
      <UpdateEmailForm currentEmail={me?.data.email} />

      <Divider />

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
