/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import AuthService from "@/services/auth/auth.service";
import { Button, Input } from "antd";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useEmojiValidation } from "@/hooks/use-emoji-validation";

function VerifyPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorNewPassword, setErrorNewPassword] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");

  const { handleInputChange, handlePaste } = useEmojiValidation({
    fieldName: "Password",
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? null;

  const router = useRouter();

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
      await AuthService.resetPassword({
        password: newPassword,
        token,
      });
      setConfirmPassword("");
      setNewPassword("");
      toast.success("Password anda berhasil diperbarui");
      router.push("/login");
    } catch (error: any) {
      console.error("Error update password");
    }
  };

  return (
    <section className="flex gap-4 items-center justify-center flex-col min-h-screen">
      <div className="border p-3 rounded-md space-y-3">
        <div className="font-semibold text-center">
          Reset Password Akun Wali
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs">Password Baru</label>
            <Input.Password
              placeholder="Password Baru"
              value={newPassword}
              onChange={handleInputChange(handleChangeNewPassword)}
              onPaste={handlePaste}
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
              onChange={handleInputChange(handleChangeConfirmPassword)}
              onPaste={handlePaste}
            />
            {errorConfirm && (
              <p className="text-red-500 text-xs">{errorConfirm}</p>
            )}
          </div>

          <Button
            disabled={Boolean(
              errorNewPassword ||
                errorConfirm ||
                !confirmPassword ||
                !newPassword
            )}
            type="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
        <div className="w-full flex justify-center">
          <Image
            alt="logo"
            src="/images/smart-logo.svg"
            width={500}
            height={300}
            className="w-32"
          />
        </div>
      </div>
    </section>
  );
}

export default VerifyPassword;
