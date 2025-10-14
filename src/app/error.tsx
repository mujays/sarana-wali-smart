"use client";

import { Button } from "antd";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error);
  }, [error]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32">
            <Image
              src="/images/smart-logo.png"
              alt="Smart School Logo"
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
        </div>

        {/* Error Animation */}
        <div className="relative">
          <div className="text-8xl font-bold text-red-600 opacity-20 select-none">
            ERROR
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-white w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Terjadi Kesalahan
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi administrator.
          </p>
          
          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mt-4 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Error Details (Development Mode):</h3>
              <pre className="text-sm text-gray-600 overflow-auto">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-4 my-8">
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-150"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            type="primary"
            size="large"
            icon={<RefreshCcw size={18} />}
            onClick={reset}
            className="min-w-[160px] h-12 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
          >
            Coba Lagi
          </Button>

          <Button
            size="large"
            icon={<RefreshCcw size={18} />}
            onClick={handleRefresh}
            className="min-w-[160px] h-12 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600"
          >
            Muat Ulang Halaman
          </Button>

          <Button
            size="large"
            icon={<Home size={18} />}
            className="min-w-[160px] h-12 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
          >
            <Link href="/" className="text-current">
              Kembali ke Beranda
            </Link>
          </Button>
        </div>

        {/* Support Information */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Butuh Bantuan?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/30">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-600 text-sm">📧</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Email Support</span>
              <span className="text-xs text-gray-600">support@smartschool.com</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-lg bg-white/30">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-green-600 text-sm">📞</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Hotline</span>
              <span className="text-xs text-gray-600">+62 123 456 789</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-lg bg-white/30">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-purple-600 text-sm">💬</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Live Chat</span>
              <span className="text-xs text-gray-600">08:00 - 17:00 WIB</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} Smart School Wali
        </div>
      </div>
    </div>
  );
}