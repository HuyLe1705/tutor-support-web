"use client";
import Header from '@/components/Header';
import { STATS_DATA } from '@/data/mockData';

export default function Dashboard() {
  return (
    <>
      <Header title="Trang chủ" />
      <main className="p-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Thống kê sử dụng</h3>
          
          <div className="flex items-end justify-between h-64 px-4 mt-8 space-x-2">
            {STATS_DATA.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div className="relative w-full flex justify-center">
                    <div 
                        className="w-full max-w-[40px] bg-red-600 rounded-t-sm hover:bg-red-700 transition-all duration-300" 
                        style={{ height: `${item.value * 2}px` }}
                    >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                            {item.value}
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 rotate-0">{item.month}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4 font-medium">Biểu đồ tần suất đăng nhập theo tháng</p>
        </div>

        <div className="bg-blue-500 text-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
                <h4 className="font-bold text-lg">LƯỢT ĐĂNG NHẬP GẦN NHẤT</h4>
                <p className="text-2xl font-bold mt-1">2025/10/25 21:07:51</p>
            </div>
            <div className="text-right">
                <p className="text-sm opacity-80">Tổng lượt đăng nhập</p>
                <p className="text-3xl font-bold">605</p>
            </div>
        </div>
      </main>
    </>
  );
}