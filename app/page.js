"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-lg flex overflow-hidden h-[650px]">
        
        {/* Cột Trái: Hình ảnh */}
        <div className="w-1/2 relative hidden md:block bg-blue-900">
           <div className="absolute inset-0 bg-blue-900/40 z-10"></div>
           <img 
             src="https://hcmut.edu.vn/img/about/campus.jpg" 
             alt="HCMUT Campus" 
             className="w-full h-full object-cover opacity-80"
           />
           <div className="absolute top-8 left-8 z-20 text-white">
             <h1 className="text-2xl font-bold drop-shadow-md">ĐẠI HỌC QUỐC GIA TP.HCM</h1>
             <h2 className="text-xl font-semibold drop-shadow-md">TRƯỜNG ĐẠI HỌC BÁCH KHOA</h2>
           </div>
        </div>

        {/* Cột Phải: Form Đăng nhập */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-[#F8F9FA]">
          <div className="text-center mb-6">
             <h2 className="text-3xl font-bold text-blue-600 mb-2">BK Tutor Program</h2>
             <p className="text-gray-500 text-sm">Đăng nhập để vào hệ thống</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="text-red-500 text-xs text-center bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </div>
              )}
              
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Tên đăng nhập" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Mật khẩu" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 w-3 h-3" /> 
                  Ghi nhớ đăng nhập
                </label>
                <Link href="#" className="text-blue-600 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-center shadow-md hover:shadow-lg transition duration-200 text-sm"
              >
                Đăng nhập
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-400">Hoặc</span></div>
              </div>

              <div className="space-y-2">
                <Link 
                  href="/login/cas" 
                  className="flex items-center justify-center w-full border border-blue-600 text-blue-600 font-semibold py-2.5 rounded-lg hover:bg-blue-50 transition duration-200 text-sm"
                >
                  <span className="mr-2 text-lg">🏫</span> Tài khoản HCMUT (SSO)
                </Link>
                
                <Link 
                  href="/login/admin" 
                  className="block w-full border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-50 text-center transition duration-200 text-sm"
                >
                  Admin
                </Link>
              </div>

              {/* Khu vực Test Nhanh (Siêu nhỏ) */}
              <div className="mt-4 pt-2 border-t border-dashed border-gray-100 flex justify-center items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-gray-400">Quick Fill:</span>
                <button type="button" onClick={() => { setUsername("sv1"); setPassword("123"); }} className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-0.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition">SV</button>
                <button type="button" onClick={() => { setUsername("tutor1"); setPassword("123"); }} className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-0.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition">Tutor</button>
                <button type="button" onClick={() => { setUsername("both1"); setPassword("123"); }} className="text-[10px] bg-gray-50 border border-gray-200 px-2 py-0.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition">Mixed</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}