"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Tag, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  // 1. Khai báo State để chứa dữ liệu thật
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ lastLogin: '...', totalLogins: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Hàm gọi API
  const fetchData = async () => {
    try {
      setLoading(true);
      // Gọi API chúng ta vừa tạo ở Bước 1
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to fetch data');
      
      const jsonData = await res.json();
      setData(jsonData.chartData);
      setSummary(jsonData.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Gọi API khi trang vừa load
  useEffect(() => {
    fetchData();
  }, []);

  // Hàm tính chiều cao cột dynamic (Để cột cao nhất luôn full khung)
  const calculateHeight = (value) => {
    if (data.length === 0) return 0;
    const maxValue = Math.max(...data.map(d => d.value));
    // Quy đổi ra pixel: Giá trị / Max * 150px (chiều cao tối đa muốn hiển thị)
    return (value / maxValue) * 150; 
  };

  return (
    // Thêm pt-[60px] để tránh bị Header xanh che mất
    <div className="flex flex-col min-h-screen bg-[#ECF0F5] font-sans">
      
      <Header title="Ứng dụng" />

      <main className="p-6">
        <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl text-gray-700 font-normal">
                Ứng dụng <span className="text-xs text-gray-400 pl-1">BKPortal</span>
            </h3>
            {/* Nút Refresh dữ liệu thật */}
            <button onClick={fetchData} title="Làm mới dữ liệu" className="p-2 bg-white rounded shadow hover:bg-gray-50 text-gray-600">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
        </div>

        {/* --- HIỂN THỊ KHI ĐANG LOADING --- */}
        {loading ? (
           <div className="h-64 flex items-center justify-center bg-white rounded shadow-sm">
              <span className="text-gray-500 text-sm">Đang tải dữ liệu thống kê...</span>
           </div>
        ) : error ? (
           <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* --- 1. BIỂU ĐỒ (DỮ LIỆU THẬT TỪ API) --- */}
            <div className="flex-1 w-full bg-white border-t-[3px] border-[#3c8dbc] rounded-sm shadow-sm relative animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-700">Thống kê sử dụng</h4>
                  <button className="text-gray-400 hover:text-gray-600 font-bold">−</button>
              </div>

              <div className="p-4">
                  <p className="text-xs font-bold text-center text-gray-800 mb-6">Thống kê tần suất đăng nhập</p>
                  
                  <div className="h-[200px] flex items-end justify-between gap-2 px-4 border-l border-b border-gray-300 relative pb-6 ml-8">
                      {/* Trục tung (Dynamic theo dữ liệu max) */}
                      <div className="absolute left-[-35px] top-0 h-full flex flex-col justify-between text-[10px] text-gray-500 font-medium">
                          {/* Tính toán sơ bộ các mốc trục tung */}
                          <span>{Math.max(...data.map(d=>d.value))}</span>
                          <span>{Math.round(Math.max(...data.map(d=>d.value)) / 2)}</span>
                          <span>0</span>
                      </div>

                      {/* Lưới ngang */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                          <div className="border-t border-gray-100 w-full h-0"></div>
                          <div className="border-t border-gray-100 w-full h-0"></div>
                          <div className="border-t border-gray-100 w-full h-0"></div>
                      </div>

                      {/* Render Các Cột Từ State Data */}
                      {data.map((item, index) => (
                          <div key={index} className="flex flex-col items-center w-full z-10 group relative">
                              {/* Tooltip */}
                              <div className="absolute -top-8 bg-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                  {item.value} lượt
                              </div>
                              
                              {/* Cột màu đỏ - Chiều cao tính toán động */}
                              <div 
                                  className="w-full max-w-[15px] md:max-w-[25px] bg-[#dd4b39] hover:opacity-90 transition-all duration-500 cursor-pointer ease-out" 
                                  style={{ height: `${calculateHeight(item.value)}px` }} 
                              ></div>
                              
                              <span className="text-[9px] text-gray-500 mt-2 whitespace-nowrap">
                                  {item.month}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>
            </div>

            {/* --- 2. BOX THÔNG TIN (DỮ LIỆU THẬT) --- */}
            <div className="w-full lg:w-[350px]">
               <div className="bg-[#00C0EF] text-white flex rounded-sm shadow-sm overflow-hidden min-h-[90px]">
                  <div className="bg-[#00A7D0] w-[90px] flex items-center justify-center flex-shrink-0">
                      <Tag size={42} className="text-white opacity-80 -rotate-45" strokeWidth={1.5} />
                  </div>
                  
                  <div className="p-3 flex-1 flex flex-col justify-center">
                      <span className="block text-[11px] font-bold uppercase opacity-90 tracking-wide">
                          LƯỢT ĐĂNG NHẬP GẦN NHẤT
                      </span>
                      <div className="mt-1">
                          {/* Hiển thị thời gian từ API */}
                          <span className="block text-lg font-bold leading-tight">
                            {summary.lastLogin}
                          </span>
                          {/* Hiển thị tổng số từ API */}
                          <span className="block text-[11px] mt-1 opacity-80 font-medium">
                              Tổng lượt đăng nhập: {summary.totalLogins}
                          </span>
                      </div>
                  </div>
              </div>
              
              <div className="text-right mt-1">
                   <span className="text-[10px] text-gray-400 cursor-pointer hover:text-blue-500">
                      BKPortal Trang chủ
                   </span>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}