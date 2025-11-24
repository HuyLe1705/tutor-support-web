"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // chặn reload trang + chặn submit mặc định

    // TODO: thay bằng gọi API / kiểm tra thật
    if (username === "ad" && password === "123") {
      // ở đây bạn có thể set currentUser / token trước rồi mới push
      router.push("/admin/dashboard");
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-lg flex overflow-hidden h-[600px]">
        {/* Cột Trái */}
        <div className="w-1/2 relative hidden md:flex bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 items-center justify-center overflow-hidden">
          {/* Vòng tròn trang trí mờ mờ */}
          <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl opacity-60" />
          <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-blue-300/20 blur-3xl opacity-70" />

          {/* Nội dung chính */}
          <div className="relative z-10 max-w-sm text-center text-white px-6">
            {/* Logo trong vòng tròn */}
            <div className="mx-auto mb-5 h-60 w-60 rounded-full bg-white border border-white/40 flex items-center justify-center shadow-lg">
              <img
                src="/Image/logobk.png"
                alt="Logo Bách Khoa"
                className="h-100 w-100 object-contain"
              />
            </div>

            <p className="text-xs tracking-[0.2em] uppercase text-blue-100/80 mb-2">
              Đại học Quốc gia TP.HCM
            </p>
            <h1 className="text-2xl font-bold leading-snug">
              TRƯỜNG ĐẠI HỌC BÁCH KHOA
            </h1>
          </div>

          {/* Text nhỏ ở góc dưới */}
          <div className="absolute bottom-4 left-6 text-[11px] text-blue-100/80">
            © BK Tutor Program · Admin Portal
          </div>
        </div>

        

        {/* Cột Phải: Form Admin */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-[#F8F9FA]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              BK Tutor Program
            </h2>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Admin
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-center transition duration-200"
              >
                Đăng nhập
              </button>
            </form>

            <Link
              href="/"
              className="block text-center text-sm text-gray-500 hover:text-blue-600 mt-4"
            >
              ← Quay lại trang chính
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
