import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-lg flex overflow-hidden h-[600px]">
        {/* Cột Trái: Giữ nguyên hình ảnh */}
        <div className="w-1/2 relative hidden md:block bg-blue-900">
           <div className="absolute inset-0 bg-blue-900/20 z-10"></div>
           <img src="https://hcmut.edu.vn/img/about/campus.jpg" alt="HCMUT Campus" className="w-full h-full object-cover"/>
           <div className="absolute top-8 left-8 z-20 text-white">
             <h1 className="text-2xl font-bold drop-shadow-md">ĐẠI HỌC QUỐC GIA TP.HCM</h1>
             <h2 className="text-xl font-semibold drop-shadow-md">TRƯỜNG ĐẠI HỌC BÁCH KHOA</h2>
           </div>
        </div>

        {/* Cột Phải: Form Admin */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-[#F8F9FA]">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-blue-600 mb-2">BK Tutor Program</h2>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {/* Tiêu đề Admin */}
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input type="password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <Link href="/dashboard" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-center transition duration-200">
                Đăng nhập
              </Link>
              
              <Link href="/" className="block text-center text-sm text-gray-500 hover:text-blue-600">
                ← Quay lại trang chính
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}