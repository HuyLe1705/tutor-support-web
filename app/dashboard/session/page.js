"use client";
import Header from '@/components/Header';
import { SESSIONS, MENTEES } from '@/data/mockData';

import { useState } from 'react';
import { Search, Users  } from 'lucide-react';
export default function SessionPage() {
  // State giả lập để chọn phiên xem chi tiết
  const [selectedSessionId, setSelectedSessionId] = useState(SESSIONS[0].id);
  
  const currentSession = SESSIONS.find(s => s.id === selectedSessionId);
  const currentMentees = MENTEES.filter(m => m.sessionId === "S001"); // Hardcode filter để demo

  return (
    <>
      <Header title="Xem danh sách mentee của phiên" />
      <main className="p-8">
        
        {/* Bảng 1: Danh sách các phiên */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Danh sách phiên tư vấn</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Tiêu đề</th>
                  <th className="px-6 py-3">Thời gian</th>
                  <th className="px-6 py-3">Hình thức</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3 text-center">Số người</th>
                  <th className="px-6 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {SESSIONS.map((session) => (
                  <tr key={session.id} className={`border-b hover:bg-gray-50 ${selectedSessionId === session.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{session.title}</td>
                    <td className="px-6 py-4">{session.time}</td>
                    <td className="px-6 py-4">{session.format}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${session.status === 'Đã diễn ra' ? 'bg-blue-100 text-blue-800' : 
                              session.status === 'Sắp tới' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        `}>
                            {session.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">{session.current}/{session.max}</td>
                    <td className="px-6 py-4 text-right">
                        <button 
                            onClick={() => setSelectedSessionId(session.id)}
                            className="text-blue-600 hover:underline flex items-center justify-end gap-1 ml-auto"
                        >
                            <Users size={14} /> Xem danh sách mentee
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bảng 2: Danh sách Mentee chi tiết */}
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                Danh sách mentee của phiên: <span className="text-blue-600">({currentSession?.title})</span>
            </h3>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 mb-6 bg-gray-50 p-4 rounded-lg items-center justify-between">
                <div className="flex gap-3 flex-1">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
                        <input type="text" placeholder="Tìm kiếm Họ tên/Mã SV" className="pl-9 pr-4 py-2 border rounded text-sm w-64 focus:outline-blue-500"/>
                    </div>
                    <select className="border rounded px-3 py-2 text-sm text-gray-600"><option>Trạng thái đăng ký: Tất cả</option></select>
                    <select className="border rounded px-3 py-2 text-sm text-gray-600"><option>Điểm danh: Tất cả</option></select>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1">
                        <Download size={14}/> Export CSV
                    </button>
                    <button className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1">
                        <FileText size={14}/> Export PDF
                    </button>
                </div>
            </div>

            {/* Mentee Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Họ tên</th>
                            <th className="px-4 py-3">Mã SV</th>
                            <th className="px-4 py-3">Liên hệ</th>
                            <th className="px-4 py-3">Trạng thái ĐK</th>
                            <th className="px-4 py-3">Điểm danh</th>
                            <th className="px-4 py-3">Thời điểm đăng ký</th>
                            <th className="px-4 py-3">Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMentees.map((mentee) => (
                            <tr key={mentee.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 font-medium text-gray-900">{mentee.name}</td>
                                <td className="px-4 py-4">{mentee.mssv}</td>
                                <td className="px-4 py-4">{mentee.contact}</td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        mentee.status === 'Đã đăng ký' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {mentee.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        mentee.attendance.includes('Có mặt') ? 'bg-blue-500 text-white' : 
                                        mentee.attendance.includes('Vắng') ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {mentee.attendance}
                                    </span>
                                </td>
                                <td className="px-4 py-4">{mentee.regDate}</td>
                                <td className="px-4 py-4 text-gray-400 italic">{mentee.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 border-t pt-4">
                <span className="text-sm text-gray-600">Dòng mỗi trang: 10</span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">Previous</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">2</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">Next</button>
                </div>
            </div>
        </div>
      </main>
    </>
  );
}

