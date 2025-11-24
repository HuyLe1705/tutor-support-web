"use client";

import React, { useState } from "react";
import { Download, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProgressRow = {
  studentId: string;
  studentName: string;
  faculty: string;
  program: string;
  tutorName: string;
  totalSessions: number;
  attendedSessions: number;
  avgScore: number;
};

const mockProgressData: ProgressRow[] = [
  {
    studentId: "2311041",
    studentName: "Huỳnh Huy Hoàng",
    faculty: "KH&KT Máy tính",
    program: "Tutor CS1",
    tutorName: "GV Nguyễn A",
    totalSessions: 8,
    attendedSessions: 8,
    avgScore: 4.8,
  },
  {
    studentId: "2311159",
    studentName: "Lê Thanh Huy",
    faculty: "KH&KT Máy tính",
    program: "Tutor DS&A",
    tutorName: "GV Trần B",
    totalSessions: 6,
    attendedSessions: 5,
    avgScore: 4.2,
  },
  {
    studentId: "2311080",
    studentName: "Trần Nguyễn Kim Hoàng",
    faculty: "Điện",
    program: "Tutor Mạch Điện",
    tutorName: "GV Phạm C",
    totalSessions: 7,
    attendedSessions: 6,
    avgScore: 4.0,
  },
];

export default function ProgressReportPage() {
  const [filters, setFilters] = useState({
    semester: "HK251",
    faculty: "Tất cả",
    tutor: "",
    studentSearch: "",
  });

  const handleChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // TODO: gọi API lấy dữ liệu tiến độ theo filters
    console.log("Search progress report với filters", filters);
  };

  const handleExport = () => {
    // TODO: gọi API export tiến độ: /api/admin/reports/progress?...
    console.log("Export progress data", filters);
  };

  const attendanceRate = (row: ProgressRow) =>
    row.totalSessions === 0
      ? "–"
      : `${Math.round((row.attendedSessions / row.totalSessions) * 100)}%`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Báo cáo tiến độ buổi học
        </h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi chi tiết tiến độ học tập của mentee theo từng chương trình, tutor
          và khoa; hỗ trợ trích xuất dữ liệu cho phân tích sâu hơn.
        </p>
      </div>

      <Card className="border border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Bộ lọc báo cáo tiến độ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Học kỳ + Khoa */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-xs mb-1 font-medium text-muted-foreground">
                Học kỳ
              </label>
              <select
                className="h-9 rounded-md border px-3 text-sm bg-background"
                value={filters.semester}
                onChange={(e) => handleChange("semester", e.target.value)}
              >
                <option value="HK241">HK241</option>
                <option value="HK242">HK242</option>
                <option value="HK251">HK251</option>
                <option value="HK252">HK252</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1 font-medium text-muted-foreground">
                Khoa / Đơn vị
              </label>
              <select
                className="h-9 rounded-md border px-3 text-sm bg-background"
                value={filters.faculty}
                onChange={(e) => handleChange("faculty", e.target.value)}
              >
                <option value="Tất cả">Tất cả</option>
                <option value="KH&KT Máy tính">Khoa KH&KT Máy tính</option>
                <option value="Điện">Khoa Điện</option>
                <option value="Cơ khí">Khoa Cơ khí</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1 font-medium text-muted-foreground">
                Tutor
              </label>
              <input
                type="text"
                placeholder="Nhập tên tutor (tùy chọn)"
                className="h-9 rounded-md border px-3 text-sm bg-background"
                value={filters.tutor}
                onChange={(e) => handleChange("tutor", e.target.value)}
              />
            </div>
          </div>

          {/* Tìm theo sinh viên + nút action */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col md:col-span-2">
              <label className="text-xs mb-1 font-medium text-muted-foreground">
                Tìm kiếm sinh viên
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MSSV hoặc họ tên"
                  className="h-9 flex-1 rounded-md border px-3 text-sm bg-background"
                  value={filters.studentSearch}
                  onChange={(e) => handleChange("studentSearch", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-1" />
                Lọc
              </Button>
              <Button size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Xuất dữ liệu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bảng dữ liệu tiến độ */}
      <Card className="border border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Kết quả báo cáo tiến độ (demo)
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-2">MSSV</th>
                <th className="text-left py-2">Họ và tên</th>
                <th className="text-left py-2">Khoa</th>
                <th className="text-left py-2">Chương trình</th>
                <th className="text-left py-2">Tutor</th>
                <th className="text-right py-2"># Phiên</th>
                <th className="text-right py-2"># Có mặt</th>
                <th className="text-right py-2">Tỉ lệ điểm danh</th>
                <th className="text-right py-2">Điểm TB</th>
              </tr>
            </thead>
            <tbody>
              {mockProgressData.map((row) => (
                <tr key={row.studentId} className="border-b last:border-0">
                  <td className="py-2 pr-4">{row.studentId}</td>
                  <td className="py-2 pr-4">{row.studentName}</td>
                  <td className="py-2 pr-4">{row.faculty}</td>
                  <td className="py-2 pr-4">{row.program}</td>
                  <td className="py-2 pr-4">{row.tutorName}</td>
                  <td className="py-2 text-right">{row.totalSessions}</td>
                  <td className="py-2 text-right">{row.attendedSessions}</td>
                  <td className="py-2 text-right">{attendanceRate(row)}</td>
                  <td className="py-2 text-right">
                    {row.avgScore.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            * Dữ liệu mock. Ở bản thật, mỗi dòng có thể thêm nút “Xem chi tiết” để
            drill-down tới trang buổi học / phản hồi cụ thể của sinh viên đó.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
