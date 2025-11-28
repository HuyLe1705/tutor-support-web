"use client";
import Header from '@/components/Header';
import { REPORT } from '@/data/mockData';
import { Search, Calendar, Users, CheckCircle, Loader } from 'lucide-react';
import { Download,FileText } from 'lucide-react';

export default function SessionListPage() {
  return (
    <>
      <Header title="Danh sách các buổi học" />
      <main className="p-8">

        {/* Khối chính */}
        <div className="bg-white rounded-lg shadow p-6">

          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            Các buổi học trong kỳ
          </h3>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 mb-6 bg-gray-50 p-4 rounded-lg items-center justify-between">
            <div className="flex gap-3 flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input
                  type="text"
                  placeholder="Tìm kiếm tên buổi học"
                  className="pl-9 pr-4 py-2 border rounded text-sm w-64 focus:outline-blue-500"
                />
              </div>

              <select className="border rounded px-3 py-2 text-sm text-gray-600">
                <option>Trạng thái: Tất cả</option>
                <option>Đang diễn ra</option>
                <option>Hoàn thành</option>
                <option>Chưa bắt đầu</option>
              </select>
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
        
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Tên buổi học</th>
                  <th className="px-4 py-3">Số lượng SV</th>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3">Điểm trung bình</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ghi chú</th>
                </tr>
              </thead>

              <tbody>
                {REPORT.map((session) => (
                  <tr key={session.id} className="border-b hover:bg-gray-50">
                    
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {session.title}
                    </td>

                    <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1">
                        <Users size={16} className="text-gray-400" />
                        {session.studentCount} SV
                    </span>
                    </td>

                    <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1">
                        <Calendar size={16} className="text-gray-400" />
                        {session.time}
                    </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-semibold text-blue-600">
                        {session.avgScore ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit
                          ${
                            session.status === "Hoàn thành"
                              ? "bg-green-100 text-green-700"
                              : session.status === "Đang diễn ra"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-200 text-gray-700"
                          }
                        `}
                      >
                        {session.status === "Hoàn thành" && <CheckCircle size={14} />}
                        {session.status === "Đang diễn ra" && <Loader size={14} />}
                        {session.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-400 italic">
                      {session.note || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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


