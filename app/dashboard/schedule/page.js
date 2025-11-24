"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { TUTOR_SCHEDULES } from '@/data/mockData'; 

const dayMap = { 
    'T2': 'Thứ 2', 'T3': 'Thứ 3', 'T4': 'Thứ 4', 
    'T5': 'Thứ 5', 'T6': 'Thứ 6', 'T7': 'Thứ 7', 'CN': 'Chủ nhật' 
};
const reverseDayMap = Object.fromEntries(Object.entries(dayMap).map(([k, v]) => [v, k]));

// --- [MỚI] HÀM HELPER: Đổi giờ "HH:mm" sang số phút để so sánh ---
const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.trim().split(':').map(Number);
    return hours * 60 + minutes;
};

export default function SchedulePage() {
  const [schedules, setSchedules] = useState(TUTOR_SCHEDULES);
  const [showForm, setShowForm] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form State
  const [selectedDays, setSelectedDays] = useState(['T2']);
  const [format, setFormat] = useState('Online');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');

  // Load/Save LocalStorage (Giữ nguyên như cũ)
  useEffect(() => {
    const savedData = localStorage.getItem('my_tutor_schedules');
    if (savedData) setSchedules(JSON.parse(savedData));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('my_tutor_schedules', JSON.stringify(schedules));
  }, [schedules, isLoaded]);

  // --- HANDLERS ---

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch này không?")) {
      setSchedules(prev => prev.filter(s => s.id !== id));
      if (editingId === id) handleCancel(); 
    }
  };

  const handleDayToggle = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id); 
    setShowForm(true); 
    const [start, end] = schedule.time.split('-'); 
    if(start) setStartTime(start.trim());
    if(end) setEndTime(end.trim());
    setFormat(schedule.type);
    const code = reverseDayMap[schedule.day];
    if (code) setSelectedDays([code]);
    document.getElementById('schedule-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- [QUAN TRỌNG] HÀM LOGIC KIỂM TRA TRÙNG ---
  const checkConflict = (newDays, startStr, endStr, ignoreId = null) => {
      const newStart = timeToMinutes(startStr);
      const newEnd = timeToMinutes(endStr);

      // 1. Kiểm tra logic giờ cơ bản
      if (newStart >= newEnd) {
          alert("Giờ kết thúc phải lớn hơn giờ bắt đầu!");
          return true; // Có lỗi
      }

      // 2. Duyệt qua từng ngày người dùng đang chọn
      for (const dayCode of newDays) {
          const dayName = dayMap[dayCode];

          // Tìm xem trong danh sách lịch CŨ có cái nào trùng không
          const conflictItem = schedules.find(existingItem => {
              // Nếu đang sửa thì bỏ qua chính nó
              if (ignoreId && existingItem.id === ignoreId) return false;

              // Khác ngày thì không trùng
              if (existingItem.day !== dayName) return false;

              // Lấy giờ của lịch cũ
              const [oldStartStr, oldEndStr] = existingItem.time.split('-');
              const oldStart = timeToMinutes(oldStartStr);
              const oldEnd = timeToMinutes(oldEndStr);

              // Công thức Overlap: (StartA < EndB) && (StartB < EndA)
              return (newStart < oldEnd) && (oldStart < newEnd);
          });

          if (conflictItem) {
              alert(`Xung đột lịch! \nNgày ${dayName} đã có lịch: ${conflictItem.time} (${conflictItem.type})`);
              return true; // Có trùng
          }
      }
      return false; // Không trùng
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
        alert("Vui lòng chọn ít nhất 1 ngày!");
        return;
    }

    // --- BƯỚC KIỂM TRA TRƯỚC KHI LƯU ---
    // Gọi hàm checkConflict, truyền vào các tham số cần thiết
    const hasError = checkConflict(selectedDays, startTime, endTime, editingId);
    if (hasError) return; // Nếu có lỗi hoặc trùng lịch thì dừng ngay, không lưu

    // Nếu ổn thì tiếp tục tạo object như cũ
    const newItems = selectedDays.map(dateCode => ({
        id: editingId && selectedDays.length === 1 ? editingId : Date.now() + Math.random(),
        day: dayMap[dateCode],
        time: `${startTime}-${endTime}`,
        type: format
    }));

    if (editingId) {
        setSchedules(prev => {
            const filtered = prev.filter(item => item.id !== editingId);
            return [...filtered, ...newItems]; // Lưu ý: Logic này đơn giản, nếu sửa 1 ngày thành nhiều ngày có thể cần check kỹ hơn, nhưng tạm thời ổn với UI này.
        });
        alert("Đã cập nhật thành công!");
    } else {
        setSchedules(prev => [...prev, ...newItems]);
        alert("Đã thêm mới thành công!");
    }
    handleCancel(); 
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    setSelectedDays(['T2']);
    setStartTime('09:00');
    setEndTime('10:30');
    setFormat('Online');
  };

  if (!isLoaded) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen bg-[#ECF0F5] font-sans text-sm text-[#333]">
      <Header title="Thiết lập lịch rảnh" />

      <main className="pt-[80px] p-4 md:ml-64 transition-all duration-300">
        <div className="mb-3 flex items-baseline gap-2">
            <h1 className="text-2xl font-semibold text-gray-800">Tutor</h1>
            <span className="text-sm text-gray-500">Thiết lập lịch rảnh</span>
        </div>

        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm mb-4 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-[18px] font-normal text-[#444]">Lịch rảnh định kỳ</h3>
                <button 
                    onClick={() => { if(confirm("Reset dữ liệu mẫu?")) setSchedules(TUTOR_SCHEDULES); }}
                    className="text-xs text-red-500 hover:underline"
                >
                    Reset dữ liệu mẫu
                </button>
            </div>
            
            <div className="p-5">
                {schedules.length === 0 ? (
                     <div className="text-gray-500 italic">Chưa có lịch nào.</div>
                ) : (
                    <div className="space-y-4 max-w-2xl">
                        {schedules.map((schedule) => (
                            <div key={schedule.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <input 
                                    readOnly
                                    value={`${schedule.day}, ${schedule.time} (${schedule.type})`}
                                    className={`flex-1 px-3 py-1.5 bg-white border rounded-sm focus:outline-none shadow-none h-[34px]
                                        ${editingId === schedule.id ? 'border-[#3c8dbc] bg-blue-50 text-blue-800 font-medium' : 'border-[#d2d6de] text-[#555]'}
                                    `} 
                                />
                                <div className="flex gap-1 shrink-0">
                                    <button onClick={() => handleEdit(schedule)} className="px-3 py-1 bg-[#0073b7] hover:bg-[#00639e] text-white text-xs font-bold rounded-[3px] shadow-sm h-[34px] min-w-[70px]">Chỉnh sửa</button>
                                    <button onClick={() => handleDelete(schedule.id)} className="px-3 py-1 bg-[#0073b7] hover:bg-[#00639e] text-white text-xs font-bold rounded-[3px] shadow-sm h-[34px] min-w-[50px]">Xóa</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="mb-4">
            {!showForm && (
                <button onClick={() => { handleCancel(); setShowForm(true); }} className="bg-[#0073b7] hover:bg-[#00639e] text-white px-4 py-1.5 text-sm font-bold rounded-[3px] shadow-sm inline-flex items-center gap-1">+Tạo lịch rảnh mới</button>
            )}
        </div>

        {showForm && (
            <div id="schedule-form" className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm mb-10">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-[18px] font-bold text-[#444]">{editingId ? 'Cập nhật lịch rảnh' : 'Tạo lịch rảnh'}</h3>
                    {editingId && <span className="text-xs text-orange-500 font-bold">Đang chỉnh sửa...</span>}
                </div>

                <form onSubmit={handleSave} className="p-5">
                    <div className="mb-6 border-b border-gray-100 pb-6">
                        <label className="block text-[#333] mb-3 font-bold text-[15px]">Áp dụng cho các ngày trong tuần:</label>
                        <div className="flex flex-wrap gap-6 pl-1">
                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                                <label key={day} className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" className="w-4 h-4 text-[#0073b7] rounded-[2px] border-gray-300 focus:ring-[#0073b7]" checked={selectedDays.includes(day)} onChange={() => handleDayToggle(day)} />
                                    <span className="text-[#333] font-normal">{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <label className="block text-[#333] mb-3 font-bold text-[15px]">Khung giờ:</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-32">
                                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border border-[#d2d6de] px-3 py-1.5 text-[#555] rounded-sm focus:border-[#3c8dbc] focus:outline-none h-[34px]" />
                                </div>
                                <span className="text-gray-400 font-light text-2xl pb-1">-</span>
                                <div className="relative w-32">
                                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border border-[#d2d6de] px-3 py-1.5 text-[#555] rounded-sm focus:border-[#3c8dbc] focus:outline-none h-[34px]" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#333] mb-3 font-bold text-[15px]">Hình thức:</label>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="format" className="w-4 h-4 text-[#0073b7] border-gray-300 focus:ring-[#0073b7]" checked={format === 'Online'} onChange={() => setFormat('Online')} />
                                    <span className="text-[#333]">Trực tuyến(Online)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="format" className="w-4 h-4 text-[#0073b7] border-gray-300 focus:ring-[#0073b7]" checked={format === 'Offline'} onChange={() => setFormat('Offline')} />
                                    <span className="text-[#333]">Ngoại tuyến(Offline)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-10">
                        <button type="button" onClick={handleCancel} className="px-5 py-1.5 bg-[#0073b7] hover:bg-[#00639e] text-white text-sm font-bold rounded-[3px] shadow-sm min-w-[80px]">Hủy</button>
                        <button type="submit" className="px-5 py-1.5 bg-[#0073b7] hover:bg-[#00639e] text-white text-sm font-bold rounded-[3px] shadow-sm min-w-[80px]">Lưu</button>
                    </div>
                </form>
            </div>
        )}
      </main>
    </div>
  );
}