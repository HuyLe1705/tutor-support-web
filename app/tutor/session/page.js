// Sử dụng Client Component vì dùng hook usePathname (để highlight sidebar)
"use client"; 

import Sidebar from '@/components/Sidebar';
import { MENTEE_LIST, TUTOR_SESSIONS, TUTOR_INFO } from '@/data/hardcodedData';
import { useState } from 'react';

function MenteeListComponent() {
  const [mentees, setMentees] = useState(MENTEE_LIST);
  const [selectedSessionId, setSelectedSessionId] = useState(TUTOR_SESSIONS[0].id);
  const selectedSession = TUTOR_SESSIONS.find(s => s.id === selectedSessionId);

  // Giả lập hàm cho hành động "Xem danh sách mentee"
  const handleViewMentee = (sessionId) => {
    setSelectedSessionId(sessionId);
    alert(`Đang tải danh sách mentee cho phiên: ${TUTOR_SESSIONS.find(s => s.id === sessionId)?.title}`);
    // Trong thực tế, bạn sẽ fetch data tại đây
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Danh sách phiên tư vấn</h2>

      {/* Danh sách phiên tư vấn */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình thức</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số người</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {TUTOR_SESSIONS.map(session => (
              <tr key={session.id} className={session.id === selectedSessionId ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.format}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    session.status === 'Đã diễn ra' ? 'bg-green-100 text-green-800' : 
                    session.status === 'Sắp tới' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.participants}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewMentee(session.id)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Xem danh sách mentee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Danh sách Mentee chi tiết */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">
          Danh sách mentee của phiên ({selectedSession.title})
        </h3>
        
        {/* Thanh tìm kiếm và bộ lọc */}
        <div className="flex items-center space-x-4 mb-4">
            <input type="text" placeholder="Tìm kiếm SV/Mã SV" className="px-3 py-2 border rounded-md" />
            <select className="px-3 py-2 border rounded-md">
                <option>Trạng thái Đăng ký: Tất cả</option>
            </select>
            <select className="px-3 py-2 border rounded-md">
                <option>Điểm danh: Tất cả</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Tìm</button>
        </div>

        <div className="flex justify-end space-x-2 mb-4">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm">
                Export CSV
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm">
                Export PDF
            </button>
        </div>

        {/* Bảng danh sách Mentee */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái đăng ký</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm danh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời điểm đăng ký</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mentees.map(mentee => (
                <tr key={mentee.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mentee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mentee.mssv}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      mentee.status === 'Đã đăng ký' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {mentee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      mentee.attendance === 'Có mặt' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {mentee.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mentee.regDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mentee.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Phân trang */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>Dòng mỗi trang: 10</span>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700">
                    1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                </button>
            </nav>
        </div>
      </div>
    </div>
  );
}

export default function TutorSessionPage() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-56 flex-1 p-8 bg-gray-50">
                <header className="flex justify-between items-center pb-4 mb-6 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">Tutor / Quản lý phiên</h1>
                    <div className="text-sm text-gray-500">BKPortal | Trang chủ</div>
                </header>
                <MenteeListComponent />
            </div>
        </div>
    );
}