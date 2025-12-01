"use client";
import Header from '@/components/Header';
import { REPORT } from '@/data/mockData';
import { Search, Calendar, Users, CheckCircle, Loader } from 'lucide-react';
import { Download,FileText } from 'lucide-react';
import jsPDF from "jspdf";

export default function SessionListPage() {
  return (
    <>
      <Header title="Danh sách các buổi học" />
      <main className="p-8">

        <div className="bg-white rounded-lg shadow p-6">

          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            Các buổi học trong kỳ
          </h3>

          <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-lg items-center justify-between">
            <div className="ml-auto flex gap-2">

                <button onClick={exportCSV} className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1">
                    <Download size={14}/> Export CSV
                </button>
                <button onClick={exportPDF} className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1">
                    <FileText size={14}/> Export PDF
                </button>
            </div>
          </div>
        
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

        </div>
      </main>
    </>
  );
}

const exportCSV = () => {
  const headers = [
    "id",
    "title",
    "studentCount",
    "time",
    "avgScore",
    "status",
    "note"
  ];
  const data = [
    headers,
    ...REPORT.map(item => [
      item.id,
      item.title,
      item.studentCount,
      item.time,
      item.avgScore ?? "",
      item.status,
      item.note || ""
    ])
  ];
  let csvContent =
    "data:text/csv;charset=utf-8," +
    data.map((row) => row.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.href = encodedUri;
  link.download = "report.csv";
  link.click();
};

const exportPDF = () => {
  const doc = new jsPDF();
  let y = 15;
  doc.setFontSize(18);
  doc.text("PROGRAM REPORT", 10, y);
  y += 10;

  REPORT.forEach((item, index) => {
    doc.setFontSize(12);
    const lines = [
      `Course ID: ${item.id}`,
      `Title: ${item.title}`,
      `Number of student: ${item.studentCount}`,
      `Time: ${item.time}`,
      `Average Score: ${item.avgScore ?? "None"}`,
      `Status: ${item.status}`,
      `Note: ${item.note || "None"}`
    ];
    lines.forEach(line => {
      doc.text(line, 10, y);
      y += 7;
    });
    y += 3;
    doc.line(10, y, 200, y);
    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 15;
    }
  });
  doc.save("report.pdf");
};
