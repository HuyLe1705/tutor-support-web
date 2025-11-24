"use client";
import Header from '@/components/Header';
import { SESSIONS, MENTEES } from '@/data/mockData';
import { Search, Filter, MapPin, Star, Users, Clock, Heart, ChevronDown } from 'lucide-react';
import { useState } from 'react';

// --- MOCK DATA (Dữ liệu giả lập) ---
const TUTORS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    subject: "Lập trình Web, React",
    rating: 4.8,
    sessions: 45,
    location: "Online",
    bio: "Có 5 năm kinh nghiệm giảng dạy và làm việc với React/Node.js",
    avatar: "https://i.pravatar.cc/150?u=a", // Ảnh đại diện giả
  },
  {
    id: 2,
    name: "Trần Thị B",
    subject: "Machine Learning, Python",
    rating: 4.9,
    sessions: 62,
    location: "CS1, Tầng 3",
    bio: "Chuyên gia ML với nhiều dự án thực tế",
    avatar: "https://i.pravatar.cc/150?u=b",
  }
];

const UPCOMING_SESSIONS = [
  {
    id: 101,
    title: "Nhập môn React Hooks",
    tutor: "Nguyễn Văn A",
    time: "14:00 - 16:00, 05/11/2025",
    slots: "3/10",
    location: "Online",
  },
  {
    id: 102,
    title: "Python cho Data Science",
    tutor: "Trần Thị B",
    time: "09:00 - 11:00, 07/11/2025",
    slots: "5/15",
    location: "CS1, Phòng 301",
  }
];

// --- COMPONENT CHÍNH ---
export default function StudentRegisterPage() {
  const [showFilter, setShowFilter] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-sm text-gray-700">
      {/* 1. Header */}
      <Header title="Đăng ký Tutor" />

      {/* 2. Main Content */}
      <main className="pt-[80px] p-4 md:ml-64 transition-all duration-300 max-w-6xl mx-auto">
        
        {/* --- SECTION: TÌM KIẾM & BỘ LỌC --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3 border-b pb-2">Tìm kiếm Tutor và phiên</h2>
            
            {/* Thanh tìm kiếm */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder="Mã Phiên/Tên Phiên/ Tên Tutor" 
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {/* <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" /> */}
                </div>
                <button 
                    onClick={() => setShowFilter(!showFilter)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2 border border-gray-300"
                >
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                </button>
            </div>

            {/* Panel Bộ lọc (Ẩn/Hiện) */}
            {showFilter && (
                <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Bộ lọc</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cột 1 */}
                        <div className="space-y-4">
                            <div className="relative">
                                <select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none">
                                    <option>Thời gian</option>
                                    <option>Sáng</option>
                                    <option>Chiều</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/>
                            </div>
                            <div className="relative">
                                <select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none">
                                    <option>Loại phiên</option>
                                    <option>1-1</option>
                                    <option>Nhóm</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/>
                            </div>
                        </div>

                        {/* Cột 2 */}
                        <div className="space-y-4">
                             <div className="relative">
                                <select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none">
                                    <option>Địa điểm</option>
                                    <option>Online</option>
                                    <option>Offline</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/>
                            </div>
                            <div className="relative">
                                <select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none">
                                    <option>Đánh giá</option>
                                    <option>4 sao trở lên</option>
                                    <option>5 sao</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center mt-4">
                        <button className="text-blue-500 text-sm hover:underline">Xóa bộ lọc</button>
                    </div>
                </div>
            )}
        </div>

        {/* --- SECTION: DANH SÁCH TUTOR --- */}
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách Tutor</h2>
            <div className="space-y-4">
                {TUTORS.map((tutor) => (
                    <div key={tutor.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-md object-cover bg-gray-200" />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{tutor.name}</h3>
                                    <p className="text-gray-500 mb-2">{tutor.subject}</p>
                                    
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                        <span className="flex items-center gap-1 text-yellow-500 font-medium">
                                            <Star className="w-3 h-3 fill-current" /> {tutor.rating}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {tutor.sessions} phiên
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {tutor.location}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm italic">{tutor.bio}</p>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm shadow-blue-200">
                                            Gửi yêu cầu ghép cặp
                                        </button>
                                        <button className="text-gray-400 hover:text-red-500">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- SECTION: PHIÊN SẮP DIỄN RA --- */}
        <div className="mb-8 pt-4 border-t border-blue-200">
             <h2 className="text-xl font-bold text-gray-800 mb-4 mt-2">Phiên Sắp Diễn Ra</h2>
             <div className="space-y-4">
                {UPCOMING_SESSIONS.map((session) => (
                    <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <h3 className="text-md font-bold text-gray-800">{session.title}</h3>
                            <p className="text-gray-500 text-sm">Tutor: {session.tutor}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {session.time}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3"/> Nhóm - {session.slots}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {session.location}</span>
                            </div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors shadow-sm shadow-blue-200 min-w-[100px]">
                            Đăng ký
                        </button>
                    </div>
                ))}
             </div>
        </div>

        {/* --- SECTION: BẢNG "PHIẾU ĐĂNG KÝ" (Giống hình dưới cùng) --- */}
        <div className="mb-10">
            <h3 className="text-gray-600 mb-2 font-medium">Phiếu đăng ký</h3>
            
            {/* Table Container style giống cổng thông tin cũ */}
            <div className="border border-gray-300 bg-white">
                {/* Header xanh dương đậm */}
                <div className="bg-[#00c0ef] text-white px-3 py-2 text-sm font-bold border-b border-gray-300">
                    Danh sách đã đăng ký
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-200 text-gray-700">
                                <th className="p-2 w-10 border-r">1</th>
                                <th className="p-2 border-r min-w-[150px]">Tên phiên</th>
                                <th className="p-2 border-r w-[100px]">DK/ Sĩ số<br/><span className="font-normal text-gray-400">1/9999</span></th>
                                <th className="p-2 border-r">Giảng viên</th>
                                <th className="p-2 border-r">Nhóm BT</th>
                                <th className="p-2 border-r w-[80px]">Sĩ số LT<br/><span className="font-normal text-gray-400">99999</span></th>
                                <th className="p-2 w-[40px]">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Dòng dữ liệu chính */}
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-2 border-r text-center"></td>
                                <td className="p-2 border-r font-bold text-gray-700">
                                    <div className="grid grid-cols-5 gap-2 font-bold italic text-[11px] mb-1 text-gray-500">
                                        <span>Thứ</span>
                                        <span>Tiết</span>
                                        <span>Phòng</span>
                                        <span>CS</span>
                                        <span>Tuần học</span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 text-[11px]">
                                        <span>Chưa biết</span>
                                        <span>--</span>
                                        <span></span>
                                        <span></span>
                                        <span>1234567890123456-----------</span>
                                    </div>
                                </td>
                                <td className="p-2 border-r"></td>
                                <td className="p-2 border-r"></td>
                                <td className="p-2 border-r"></td>
                                <td className="p-2 border-r"></td>
                                <td className="p-2"></td>
                            </tr>
                            
                            {/* Có thể thêm dòng Empty State nếu muốn giống hình */}
                             <tr className="h-10">
                                <td colSpan={7}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}