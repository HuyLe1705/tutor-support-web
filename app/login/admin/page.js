"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [language, setLanguage] = useState("vi"); // 'vi' hoặc 'en'

  const toggleLanguage = () => {
    setLanguage(prev => prev === "vi" ? "en" : "vi");
  };
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    alert("Hệ thống đã gửi email khôi phục mật khẩu đến bạn!");
    setShowForgotModal(false);
  };
  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans">
      {/* 1. HEADER: Màu xanh đậm giống Bách Khoa */}
      <header className="bg-[#003366] h-16 flex items-center px-4 md:px-8 shadow-md">
        <div className="flex items-center gap-3">
      
          <div className="w-10 h-10 bg-white flex items-center justify-center p-1">
             <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/de/HCMUT_official_logo.png"
              alt="Logo HCMUT"
              />  
          </div>
          <div className="text-white leading-tight">
             <h1 className="text-xs md:text-sm font-bold uppercase opacity-90">
                {language === 'vi' ? 'Đại học Quốc gia Thành phố Hồ Chí Minh' : 'Vietnam National University Ho Chi Minh City'}
             </h1>
             <h2 className="text-sm md:text-base font-bold uppercase">
                {language === 'vi' ? 'Trường Đại học Bách Khoa' : 'Ho Chi Minh City University of Technology'}
             </h2>
           </div>
        </div>
        <div className="ml-auto flex gap-4 text-white text-sm font-medium">
            {/* Nút chuyển đổi ngôn ngữ */}
            <button 
                onClick={toggleLanguage}
                className="cursor-pointer opacity-80 hover:opacity-100 focus:outline-none"
            >
                {language === 'vi' ? 'Ngôn ngữ (Tiếng Việt)' : 'Language (English)'}
            </button>
            
            {/* Link Đăng nhập (Load lại trang này hoặc về root) */}
            <Link href="/login" className="cursor-pointer opacity-80 hover:opacity-100">
                {language === 'vi' ? 'Admin' : 'Admin'}
            </Link>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          
          {/* CỘT TRÁI: HÌNH ẢNH (To, rõ nét, bo góc nhẹ) */}
          <div className="hidden md:block w-1/2 h-[500px] shadow-xl rounded-lg overflow-hidden relative">
             <img 
                src="https://opportunities-insight.britishcouncil.org/sites/siem/files/styles/event_header/public/images/news/12%20%281%29.jpg.webp?itok=si418eJK" 
                alt="HCMUT Campus" 
                className="w-full h-full object-cover"
              />
          </div>

          {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
          <div className="w-full md:w-[400px] flex flex-col">
            {/* Tiêu đề nằm ngoài khung trắng */}
            <h2 className="text-3xl font-bold text-[#0066CC] mb-6 text-center md:text-center">
              BK Tutor Program
            </h2>

            {/* Khung trắng chứa form */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng nhập</h3>
              
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="text-red-500 text-xs text-center bg-red-50 p-2 rounded border border-red-200">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    {/* Input nền xám nhạt giống ảnh mẫu */}
                    <input 
                      type="text" 
                      placeholder="Tên đăng nhập" 
                      className="w-full px-4 py-3 bg-[#F3F4F6] border-none rounded-md text-gray-700 placeholder:text-[#030391] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <input 
                      type="password" 
                      placeholder="Mật khẩu" 
                      className="w-full px-4 py-3 bg-[#F3F4F6] border-none rounded-md text-gray-700 placeholder:text-[#030391] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                      type="checkbox" 
                      className="rounded w-4 h-4 border-gray-300 accent-[#1488D8]" 
                    />
                    {language === 'vi' ? 'Ghi nhớ đăng nhập' : 'Remember me'}
                </label>
                  <button 
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[#030391] hover:underline focus:outline-none"
                  >
                    {language === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className="block w-full bg-[#007ACC] hover:bg-[#006BB3] text-white font-bold py-3 rounded-md text-center shadow transition duration-200"
                >
                  Đăng nhập
                </button>

                

                {/* Khu vực Test Nhanh */}
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-center items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-gray-400 font-medium">Quick Fill:</span>
                  <button type="button" onClick={() => { setUsername("admin"); setPassword("123"); }} className="text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-blue-100 text-gray-600 transition">admin_demo</button>
                 
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="bg-[#003366] px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">
                {language === 'vi' ? 'Khôi phục mật khẩu' : 'Reset Password'}
              </h3>
              <button onClick={() => setShowForgotModal(false)} className="text-white hover:text-gray-300 text-xl">&times;</button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">
                {language === 'vi' 
                  ? 'Vui lòng nhập email hoặc MSSV/MSCB để nhận liên kết đặt lại mật khẩu.' 
                  : 'Please enter your email or Student/Staff ID to receive a password reset link.'}
              </p>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email / ID</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#003366] focus:outline-none"
                      placeholder="example@hcmut.edu.vn"
                    />
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    {language === 'vi' ? 'Hủy' : 'Cancel'}
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#007ACC] hover:bg-[#006BB3] rounded shadow"
                  >
                    {language === 'vi' ? 'Gửi yêu cầu' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}