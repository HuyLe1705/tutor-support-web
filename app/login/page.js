import Link from 'next/link';
import Image from 'next/image';
// Giả định đường dẫn hình ảnh của trường Bách Khoa là /bk-gate.jpg

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg flex overflow-hidden">
        
        {/* Cột trái: Hình ảnh giới thiệu */}
        <div className="hidden md:block w-1/2">
          <Image
            src="/bk-gate.jpg" // Thay bằng đường dẫn ảnh thực tế của bạn
            alt="Trường Đại học Bách Khoa"
            width={500}
            height={500}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Cột phải: Form đăng nhập */}
        <div className="w-full md:w-1/2 p-10 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-800">BK Tutor Program</h1>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Đăng nhập</h2>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">Tên đăng nhập</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Tên đăng nhập"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="sr-only">Mật khẩu</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 text-gray-600">Ghi nhớ đăng nhập</label>
                </div>
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu</Link>
              </div>
              
              {/* Nút Đăng nhập nội bộ (Giả lập) */}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đăng nhập
              </button>
            </form>

            <div className="my-6 border-t border-gray-200"></div>

            {/* Nút Đăng nhập SSO (Luồng chính) */}
            <Link 
              href="/tutor/profile" // Chuyển hướng đến trang chức năng Tutor sau khi đăng nhập SSO thành công
              className="w-full flex justify-center py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2h2V7A3 3 0 007 7v2h2V7a1 1 0 012 0z" />
              </svg>
              Tài khoản HCMUT
            </Link>
            
            <button
              className="mt-2 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}