"use client";
import Header from '@/components/Header';
import { STATS_DATA } from '@/data/mockData';
import { Tag } from 'lucide-react';
export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ECF0F5] font-sans pt-[60px]">
      
      {/* Header trắng: "Ứng dụng" */}
      <Header title="Ứng dụng" />

      <main className="p-6">
        {/* Tiêu đề trang: Ứng dụng BKPortal */}
        <div className="mb-4">
            <h3 className="text-xl text-gray-700 font-normal">
                Ứng dụng <span className="text-xs text-gray-400 pl-1">BKPortal</span>
            </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* --- 1. BIỂU ĐỒ (CỘT TRÁI) --- */}
          {/* border-t-[3px] border-[#3c8dbc]: Tạo viền xanh đậm trên đầu box */}
          <div className="flex-1 w-full bg-white border-t-[3px] border-[#3c8dbc] rounded-sm shadow-sm relative">
            
            {/* Header Box */}
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-700">Thống kê sử dụng</h4>
                {/* Nút thu nhỏ giả lập (dấu trừ) */}
                <button className="text-gray-400 hover:text-gray-600 font-bold">−</button>
            </div>

            {/* Chart Body */}
            <div className="p-4">
                <p className="text-xs font-bold text-center text-gray-800 mb-6">Thống kê tần suất đăng nhập</p>
                
                {/* Khu vực vẽ biểu đồ */}
                <div className="h-[200px] flex items-end justify-between gap-1 px-4 border-l border-b border-gray-300 relative pb-6 ml-8">
                    
                    {/* Trục tung (Y-Axis) */}
                    <div className="absolute left-[-35px] top-0 h-full flex flex-col justify-between text-[10px] text-gray-500 font-medium">
                        <span>60</span>
                        <span>40</span>
                        <span>20</span>
                        <span>0</span>
                    </div>

                    {/* Đường kẻ ngang (Grid lines) */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                        <div className="border-t border-gray-100 w-full h-0"></div>
                        <div className="border-t border-gray-100 w-full h-0"></div>
                        <div className="border-t border-gray-100 w-full h-0"></div>
                        <div className="border-t border-gray-100 w-full h-0"></div>
                    </div>

                    {/* Các cột đỏ */}
                    {STATS_DATA.map((item, index) => (
                        <div key={index} className="flex flex-col items-center w-full z-10 group relative">
                            {/* Tooltip khi hover */}
                            <div className="absolute -top-8 bg-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.value}
                            </div>
                            
                            {/* Cột màu đỏ (#dd4b39) */}
                            <div 
                                className="w-full max-w-[15px] md:max-w-[25px] bg-[#dd4b39] hover:opacity-90 transition-all cursor-pointer" 
                                style={{ height: `${item.value * 3}px` }} // *3 để cột cao hơn cho đẹp
                            ></div>
                            
                            {/* Label tháng */}
                            <span className="text-[9px] text-gray-500 mt-2 whitespace-nowrap">
                                {item.month}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* --- 2. BOX THÔNG TIN (CỘT PHẢI) --- */}
          <div className="w-full lg:w-[350px]">
             {/* Box màu xanh Cyan (#00C0EF) */}
             <div className="bg-[#00C0EF] text-white flex rounded-sm shadow-sm overflow-hidden min-h-[90px]">
                
                {/* Icon Tag bên trái (Nền đậm hơn #00A7D0) */}
                <div className="bg-[#00A7D0] w-[90px] flex items-center justify-center flex-shrink-0">
                    <Tag size={42} className="text-white opacity-80 -rotate-45" strokeWidth={1.5} />
                </div>
                
                {/* Nội dung bên phải */}
                <div className="p-3 flex-1 flex flex-col justify-center">
                    <span className="block text-[11px] font-bold uppercase opacity-90 tracking-wide">
                        LƯỢT ĐĂNG NHẬP GẦN NHẤT
                    </span>
                    <div className="mt-1">
                        <span className="block text-lg font-bold leading-tight">2025/10/25 21:42:44</span>
                        <span className="block text-[11px] mt-1 opacity-80 font-medium">
                            Tổng lượt đăng nhập: 257
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Link nhỏ góc phải */}
            <div className="text-right mt-1">
                 <span className="text-[10px] text-gray-400 cursor-pointer hover:text-blue-500">
                    BKPortal Trang chủ
                 </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}