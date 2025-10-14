import { Spin } from "antd";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo with pulse animation */}
        <div className="flex justify-center">
          <div className="w-24 h-24 animate-pulse">
            <Image
              src="/images/smart-logo.png"
              alt="Smart School Logo"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
        </div>

        {/* Loading Animation */}
        <div className="space-y-4">
          <Spin size="large" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">
              Memuat Halaman...
            </h2>
            <p className="text-sm text-gray-500">
              Harap tunggu sebentar
            </p>
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}