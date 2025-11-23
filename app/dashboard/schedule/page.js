"use client";
import Header from '@/components/Header';
import { SCHEDULES } from '@/data/mockData';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function SchedulePage() {
  return (
    <>
      <Header title="Thiết lập lịch rảnh" />
      <main className="p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Lịch rảnh định kỳ</h3>
          
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            {SCHEDULES.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between bg-white p-4 rounded border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="font-semibold text-gray-700 w-20">{schedule.day}</div>
                    <div className="text-gray-600">{schedule.time}</div>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">({schedule.type})</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1">
                    <Edit2 size={14}/> Chỉnh sửa
                  </button>
                  <button className="px-4 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center gap-1">
                    <Trash2 size={14}/> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 font-medium">
              <Plus size={18}/> Tạo lịch rảnh mới
            </button>
          </div>

          {/* Form giả lập */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-gray-700 mb-4">Tạo lịch rảnh</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Áp dụng cho các ngày:</label>
                    <div className="flex gap-3">
                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                            <label key={day} className="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" className="rounded text-blue-600 w-4 h-4" defaultChecked={day === 'T2'} />
                                <span className="text-sm text-gray-600">{day}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức:</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="type" defaultChecked className="text-blue-600" /> <span>Trực tuyến (Online)</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="type" className="text-blue-600" /> <span>Ngoại tuyến (Offline)</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Khung giờ:</label>
                <div className="flex items-center gap-2">
                    <input type="time" defaultValue="09:00" className="border rounded px-3 py-2" />
                    <span>đến</span>
                    <input type="time" defaultValue="10:30" className="border rounded px-3 py-2" />
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Hủy</button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}