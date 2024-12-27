"use client";

import Image from "@/components/common/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function LoginPage() {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <section className="min-h-screen flex items-center gap-10 p-10">
      <div className="flex-1 space-y-10">
        <div className="w-48">
          <Image alt="logo" src="/images/smart-logo.svg" />
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
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="flex-1 hidden lg:flex">
        <div className="relative h-[80%] w-full">
            <div/>
          <Image alt="logo" src="/images/banner-smartschool.png" />
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
