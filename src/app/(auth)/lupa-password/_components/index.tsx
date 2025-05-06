"use client";
import errorResponse from "@/lib/error";
import AuthService from "@/services/auth/auth.service";
import { Button, Input } from "antd";
import { AxiosError } from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

function LupaPasswordPage() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await AuthService.forgotPasswordSend({ email: value });
      toast.success("Permintaan lupa password sudah dikirim ke email");
      setValue("");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex gap-4 items-center justify-center flex-col min-h-screen">
      <div className="border p-3 rounded-md space-y-3">
        <div className="font-semibold text-center">Lupa Password Akun Wali</div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs">
            Email Terdaftar
          </label>
          <Input
            placeholder="Masukkan Email"
            id="email"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          type="primary"
          disabled={!value}
          onClick={onSubmit}
          loading={loading}
        >
          Kirim
        </Button>
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

export default LupaPasswordPage;
