"use client";

import { Button } from "antd";
import { Home, RefreshCcw, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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

        {/* 404 Animation */}
        <div className="relative">
          <div className="text-9xl font-bold text-blue-600 opacity-20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau mungkin telah dipindahkan.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-4 my-8">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-150"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            type="primary"
            size="large"
            icon={<Home size={18} />}
            className="min-w-[160px] h-12 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          >
            <Link href="/" className="text-white">
              Kembali ke Beranda
            </Link>
          </Button>

          <Button
            size="large"
            icon={<ArrowLeft size={18} />}
            onClick={handleGoBack}
            className="min-w-[160px] h-12 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
          >
            Halaman Sebelumnya
          </Button>

          <Button
            size="large"
            icon={<RefreshCcw size={18} />}
            onClick={handleRefresh}
            className="min-w-[160px] h-12 border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600"
          >
            Muat Ulang
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Mungkin Anda mencari:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/profile"
              className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-600 text-sm">👤</span>
              </div>
              <span className="text-sm text-gray-700">Profile</span>
            </Link>

            <Link
              href="/siswa"
              className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-green-600 text-sm">👨‍🎓</span>
              </div>
              <span className="text-sm text-gray-700">Siswa</span>
            </Link>

            <Link
              href="/tagihan"
              className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-orange-600 text-sm">💰</span>
              </div>
              <span className="text-sm text-gray-700">Tagihan</span>
            </Link>

            <Link
              href="/jemputan"
              className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-purple-600 text-sm">🚌</span>
              </div>
              <span className="text-sm text-gray-700">Jemputan</span>
            </Link>
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