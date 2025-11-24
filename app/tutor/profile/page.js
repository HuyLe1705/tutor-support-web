// Sử dụng Client Component vì dùng hook usePathname (để highlight sidebar)
"use client"; 

import Sidebar from '@/components/Sidebar';
import { TUTOR_SCHEDULES, TUTOR_INFO } from '@/data/mockData';
import { useState } from 'react';

// Dùng tạm component này để mô phỏng trang
function TutorScheduleComponent() {
  const [schedules, setSchedules] = useState(TUTOR_SCHEDULES);
  
  const handleAddSchedule = (e) => {
    e.preventDefault();
    // Logic giả lập thêm lịch
    alert("Giả lập: Đã thêm lịch rảnh mới!");
  };

  const handleDelete = (day) => {
    // Logic giả lập xóa lịch
    if (window.confirm(`Bạn có chắc chắn muốn xóa lịch ${day}?`)) {
      setSchedules(schedules.filter(s => s.day !== day));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Lịch rảnh đăng ký</h2>
      
      {/* Danh sách lịch đã đăng ký */}
      <div className="space-y-3 mb-8">
        {schedules.map((schedule, index) => (
          <div key={index} className="flex items-center p-3 border rounded-lg bg-gray-50 justify-between">
            <span className="font-medium">{schedule.day}, {schedule.time} ({schedule.type})</span>
            <div className="space-x-2">
              <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">Chỉnh sửa</button>
              <button 
                onClick={() => handleDelete(schedule.day)}
                className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-8" onClick={() => alert("Mở form Tạo lịch rảnh")}>
        + Tạo lịch rảnh mới
      </button>

      {/* Form Tạo lịch rảnh */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Tạo lịch rảnh</h3>
        <form onSubmit={handleAddSchedule} className="space-y-6">
          <div className="flex items-start space-x-8">
            {/* Lựa chọn ngày */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Áp dụng cho các ngày trong tuần:</label>
              <div className="flex space-x-4">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <label key={day} className="flex items-center space-x-1">
                    <input type="checkbox" name="day" value={day} className="h-4 w-4 text-blue-600 rounded" defaultChecked={day === 'T2'} />
                    <span className="text-gray-900">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Hình thức */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức:</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="format" value="Online" defaultChecked className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-900">Trực tuyến (Online)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="format" value="Offline" className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-900">Ngoài tuyến (Offline)</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Khung giờ */}
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">Khung giờ:</label>
            <input type="time" defaultValue="09:00" className="px-3 py-2 border border-gray-300 rounded-md" />
            <span className="text-gray-500"> - </span>
            <input type="time" defaultValue="10:30" className="px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div className="flex justify-end space-x-4 border-t pt-4">
            <button type="button" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">Hủy</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function TutorProfilePage() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-56 flex-1 p-8 bg-gray-50">
                <header className="flex justify-between items-center pb-4 mb-6 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">Tutor / Thiết lập lịch rảnh</h1>
                    <div className="text-sm text-gray-500">BKPortal | Trang chủ</div>
                </header>
                <TutorScheduleComponent />
            </div>
        </div>
    );
}