/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import errorResponse from "@/lib/error";
import { login } from "@/lib/session";
import AuthService from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formSchema = z.object({
    email: z.string().email("email tidak valid"),
    password: z.string().min(6, {
      message: "password must be at least 6 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log("EXAMPLE");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await AuthService.login(values);
      if (response.success) {
        login(response.data.token);
        toast.success("Login Berhasil");
        router.replace("/");
      }
    } catch (error: any) {
      errorResponse(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center gap-10 p-10">
      <div className="flex-1 space-y-10">
        <div className="w-48">
          <Image
            alt="logo"
            src="/images/smart-logo.svg"
            width={500}
            height={300}
          />
        </div>

        <div className="space-y-3">
          <p className="font-bold text-4xl">Login</p>
          <p>Login untuk mengakses aplikasi wali smart school</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input.Password
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button loading={loading} htmlType="submit" type="primary">
                Login
              </Button>
            </form>
          </Form>

          <p className="text-sm">
            Lupa password?{" "}
            <Link className="text-blue-500" href="/lupa-password">
              klik disini
            </Link>
          </p>
        </div>
      </div>
      <div className="flex-1 hidden lg:flex">
        <div className="relative w-full flex justify-center">
          <Image
            alt="Banner"
            src="/images/banner-smartschool.png"
            width={500}
            height={300}
            priority
            className="h-[80vh] w-[500px]"
          />
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
