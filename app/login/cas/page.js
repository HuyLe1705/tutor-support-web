import Link from 'next/link';

export default function CasLoginPage() {
  return (
    <div className="min-h-screen bg-[#E6E6E6] flex flex-col items-center pt-10 p-4 font-sans">
      {/* Header màu tím đặc trưng của CAS */}
      <div className="w-full max-w-4xl bg-[#000066] text-white p-4 flex items-center gap-4 border-b-4 border-[#999999]">
        <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-xl font-bold border border-white/20">BK</div>
        <h1 className="text-2xl font-bold tracking-wide">Central Authentication Service</h1>
      </div>

      {/* Nội dung chính */}
      <div className="w-full max-w-4xl bg-white shadow-md border border-gray-300 p-8 mt-6 flex flex-col md:flex-row gap-8">
        
        {/* Form đăng nhập trái */}
        <div className="flex-1 bg-[#F0F0F0] p-6 border border-gray-300 rounded-sm">
          <h2 className="text-[#990033] font-bold text-lg mb-4 border-b border-gray-300 pb-2">
            Enter your Username and Password
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Username</label>
              <input type="text" className="w-full p-2 border border-gray-400 bg-[#FFFFCC] focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Password</label>
              <input type="password" className="w-full p-2 border border-gray-400 bg-[#FFFFCC] focus:outline-none focus:border-blue-500" />
            </div>
            
            <div className="flex items-center gap-2 mt-2">
               <input type="checkbox" /> 
               <span className="text-xs text-gray-500">Warn me before logging me into other sites.</span>
            </div>

            <div className="flex gap-2 mt-4">
              {/* Nút LOGIN giả lập chuyển hướng về Dashboard */}
              <Link href="/dashboard" className="px-6 py-1 bg-[#0066CC] text-white font-bold text-sm border border-[#003399] hover:bg-[#0052a3]">
                LOGIN
              </Link>
              <button className="px-6 py-1 bg-[#0066CC] text-white font-bold text-sm border border-[#003399] hover:bg-[#0052a3]">
                CLEAR
              </button>
            </div>
            
            <div className="mt-4">
                <a href="#" className="text-blue-800 text-xs underline">Change password?</a>
            </div>
          </div>
        </div>

        {/* Thông tin bên phải */}
        <div className="flex-1 text-sm text-gray-800 space-y-4">
            <div>
                <span className="font-bold text-[#990033]">Languages:</span>
                <div className="flex gap-2 text-blue-800 underline cursor-pointer">
                    <span>Vietnamese</span>
                    <span>English</span>
                </div>
            </div>
            
            <div>
                <h3 className="font-bold text-[#990033] mb-1">Please note</h3>
                <p className="mb-2">The Login page enables single sign-on to multiple websites at HCMUT. This means that you only have to enter your user name and password once for websites that subscribe to the Login page.</p>
                <p>You will need to use your HCMUT Username and password to login to this site. The "HCMUT" account provides access to many resources including the HCMUT Information System, e-mail, ...</p>
            </div>

            <div>
                <h3 className="font-bold text-[#990033] mb-1">Technical support</h3>
                <p>E-mail: <span className="text-blue-800 underline">support@hcmut.edu.vn</span> Tel: (84-8) 38647256 - 5200</p>
            </div>
        </div>
      </div>

      <div className="mt-4 text-gray-500 text-xs">
        Copyright © 2011 - 2012 Ho Chi Minh University of Technology. All rights reserved.
        <br/>Powered by Jasig CAS 3.5.1
      </div>
    </div>
  );
}