"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import AuthContext
import { useRouter } from 'next/navigation';

export default function CasLoginPage() {
  const { login } = useAuth(); // Lấy hàm login từ context
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State để hiển thị lỗi

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Gọi hàm login từ AuthContext (Logic thật)
    const result = login(username, password);
    
    if (result.success) {
      // Nếu thành công, router.push đã được xử lý trong context,
      // hoặc bạn có thể xử lý thêm ở đây nếu muốn
    } else {
      // Nếu thất bại, hiển thị lỗi (alert hoặc text đỏ)
      setError(result.message);
      alert(result.message); // Dùng alert cho giống phong cách web cũ
    }
  };

  const handleClear = () => {
    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#E6E6E6] flex flex-col items-center pt-10 p-4 font-sans">
      
      {/* HEADER: Màu tím than đặc trưng của CAS */}
      <div className="w-full max-w-4xl bg-[#000066] text-white p-4 flex items-center gap-4 border-b-4 border-[#999999]">
        <div className="w-14 h-14 bg-white rounded flex items-center justify-center border border-white/20 p-1">
           <img 
             src="https://upload.wikimedia.org/wikipedia/commons/d/de/HCMUT_official_logo.png" 
             alt="Logo HCMUT" 
             className="w-full h-full object-contain"
           />
        </div>
        <h1 className="text-2xl font-bold tracking-wide font-sans">Central Authentication Service</h1>
      </div>

      {/* MAIN CONTENT BOX */}
      <div className="w-full max-w-4xl bg-white shadow-md border border-gray-400 p-8 mt-6 flex flex-col md:flex-row gap-8">
        
        {/* CỘT TRÁI: FORM ĐĂNG NHẬP */}
        <div className="flex-1 bg-[#E8E8E8] p-6 border border-gray-400 rounded-sm h-fit">
          {/* Tiêu đề Form */}
          <h2 className="text-[#990033] font-bold text-lg mb-4 border-b border-gray-300 pb-2">
            Enter your Username and Password
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div className="flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-1">Username:</label>
              <input 
                type="text" 
                className="w-full p-1 border border-gray-500 bg-[#FFFFCC] text-black focus:outline-none focus:border-blue-600 text-sm shadow-inner"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-1">Password:</label>
              <input 
                type="password" 
                className="w-full p-1 border border-gray-500 bg-[#FFFFCC] text-black focus:outline-none focus:border-blue-600 text-sm shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {/* Checkbox Warn */}
            <div className="flex items-start gap-2 mt-3">
               <input type="checkbox" className="mt-1" /> 
               <span className="text-[11px] text-gray-600 leading-tight">
                 Warn me before logging me into other sites.
               </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 ">
              <button 
                type="submit"
                className="px-6 py-1 bg-[#0066CC] text-white font-bold text-sm border-2 border-[#003399] hover:bg-[#0052a3] active:border-black shadow-sm"
              >
                LOGIN
              </button>
              <button 
                type="button"
                onClick={handleClear}
                className="px-6 py-1 bg-[#0066CC] text-white font-bold text-sm border-2 border-[#003399] hover:bg-[#0052a3] active:border-black shadow-sm"
              >
                CLEAR
              </button>
            </div>
            
            {/* Change Password Link */}
            <div className="mt-4 ">
                <a href="#" className="text-blue-800 text-xs underline hover:text-red-600">Change password?</a>
            </div>

            {/* (Optional) Quick Fill for Demo purpose inside CAS page if needed, 
                but kept hidden to maintain strict UI compliance */}
          </form>
        </div>

        {/* CỘT PHẢI: THÔNG TIN HƯỚNG DẪN */}
        <div className="flex-1 text-[13px] text-gray-800 space-y-5 leading-relaxed">
            {/* Languages */}
            <div>
                <span className="font-bold text-[#990033] block mb-1">Languages:</span>
                <div className="flex gap-3">
                    <span className="text-black font-bold border border-gray-400 px-1 bg-gray-100 cursor-default">English</span>
                    <span className="text-blue-800 underline cursor-pointer hover:text-red-600">Vietnamese</span>
                    {/* <span className="text-blue-800 underline cursor-pointer hover:text-red-600">Espanol</span> */} 
                </div>
            </div>
            
            {/* Please note */}
            <div>
                <h3 className="font-bold text-[#990033] text-[13px] mb-1 border-b border-gray-300 pb-1">Please note</h3>
                <p className="mb-2">
                  The Login page enables single sign-on to multiple websites at HCMUT. 
                  This means that you only have to enter your user name and password once for websites that subscribe to the Login page.
                </p>
                <p>
                  You will need to use your HCMUT Username and password to login to this site. 
                  The "HCMUT" account provides access to many resources including the HCMUT Information System, e-mail, ...
                </p>
            </div>

            {/* Technical support */}
            <div>
                <h3 className="font-bold text-[#990033] text-[13px] mb-1">Technical support</h3>
                <p>E-mail: <span className="text-blue-800 underline cursor-pointer hover:text-red-600">abc@hcmut.edu.vn</span> Tel: (84-8) 12345678 - 0000</p>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 text-gray-500 text-[10px] text-center">
        Copyright © 2011 - 2012 Ho Chi Minh University of Technology. All rights reserved.
        <br/>Powered by <span className="font-bold">Jasig CAS 3.5.1</span>
      </div>
    </div>
  );
}