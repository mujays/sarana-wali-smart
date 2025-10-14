"use client";

import { Button } from "antd";
import { Home, RefreshCcw, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  const handleRefresh = () => {
    window.location.href = "/";
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32">
                <Image
                  src="/images/smart-logo.png"
                  alt="Smart School Logo"
                  width={128}
                  height={128}
                  className="object-contain filter brightness-200"
                />
              </div>
            </div>

            {/* Critical Error Animation */}
            <div className="relative">
              <div className="text-6xl font-bold text-red-400 opacity-30 select-none">
                CRITICAL ERROR
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-bounce">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
                    <AlertCircle className="text-white w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Kesalahan Sistem Kritis
              </h1>
              <p className="text-lg text-gray-300 max-w-md mx-auto">
                Aplikasi mengalami kesalahan. Silakan muat ulang halaman atau hubungi tim teknis.
              </p>
              
              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === "development" && (
                <div className="bg-gray-800 border border-red-500 rounded-lg p-4 mt-4 text-left">
                  <h3 className="font-semibold text-red-400 mb-2">Critical Error Details:</h3>
                  <pre className="text-sm text-gray-300 overflow-auto">
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
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-75"></div>
              <div className="w-3 h-3 bg-red-700 rounded-full animate-pulse delay-150"></div>
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
                icon={<Home size={18} />}
                onClick={handleRefresh}
                className="min-w-[160px] h-12 bg-white text-gray-800 hover:bg-gray-100 border-white"
              >
                Kembali ke Beranda
              </Button>
            </div>

            {/* Footer */}
            <div className="text-sm text-gray-400 mt-8">
              © {new Date().getFullYear()} Smart School Wali
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}