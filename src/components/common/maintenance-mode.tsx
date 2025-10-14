"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function MaintenanceMode() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-20 scale-110 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-2xl border border-gray-100">
              <Image
                src="/images/logo-color.png"
                alt="Wali Smart School"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 leading-tight">
            🔧 Situs Sedang Dalam
            <span className="text-orange-400"> Perawatan</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
        </div>

        {/* Description */}
        <div className="mb-8 space-y-4">
          <p className="text-xl text-gray-600 leading-relaxed">
            Kami sedang melakukan peningkatan sistem untuk memberikan pengalaman
            yang lebih baik
          </p>
          <p className="text-lg text-gray-500">
            Terima kasih atas kesabaran Anda. Layanan akan kembali normal dalam
            waktu dekat.
          </p>
        </div>

        {/* Features Being Updated */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold text-gray-700">Performa</div>
            <div className="text-gray-500">Meningkatkan kecepatan</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl mb-2">🔒</div>
            <div className="font-semibold text-gray-700">Keamanan</div>
            <div className="text-gray-500">Update sistem keamanan</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl mb-2">✨</div>
            <div className="font-semibold text-gray-700">Fitur Baru</div>
            <div className="text-gray-500">Menambah fitur terbaru</div>
          </div>
        </div>

        {/* Current Time */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm inline-block">
            <div className="text-sm text-gray-500 mb-1">Waktu Saat Ini</div>
            <div className="text-2xl font-bold text-gray-700 font-mono">
              {currentTime.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <p className="text-gray-500 mb-4">Butuh bantuan? Hubungi kami:</p>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <span>📧</span>
              <span>support@smartschool.id</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>📞</span>
              <span>+62 123 456 7890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
