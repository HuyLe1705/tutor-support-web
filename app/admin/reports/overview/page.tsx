"use client";

import React, { useState } from "react";
import { Download, Filter, Settings2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type OverviewRow = {
  faculty: string;
  program: string;
  semester: string;
  totalSessions: number;
  attendanceRate: number;
  avgScore: number;
};

const mockOverviewData: OverviewRow[] = [
  {
    faculty: "KH&KT Máy tính",
    program: "Tutor CS1",
    semester: "HK251",
    totalSessions: 40,
    attendanceRate: 0.92,
    avgScore: 4.5,
  },
  {
    faculty: "KH&KT Máy tính",
    program: "Tutor DS&A",
    semester: "HK251",
    totalSessions: 32,
    attendanceRate: 0.88,
    avgScore: 4.3,
  },
  {
    faculty: "Điện",
    program: "Tutor Mạch Điện",
    semester: "HK251",
    totalSessions: 26,
    attendanceRate: 0.9,
    avgScore: 4.4,
  },
];

export default function OverviewReportPage() {
  const [form, setForm] = useState({
    semester: "HK251",
    fromDate: "",
    toDate: "",
    faculty: "Tất cả",
    programType: "Tất cả",
    outputFormat: "csv",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreview = () => {
    // TODO: gọi API để lấy dữ liệu preview báo cáo
    console.log("Preview overview report với params", form);
  };

  const handleExport = () => {
    // TODO: gọi API thật: /api/admin/reports/overview?...
    console.log("Export overview report", form);

    // Ví dụ:
    // fetch(`/api/admin/reports/overview?semester=${form.semester}&format=${form.outputFormat}`)
    //   .then(res => res.blob())
    //   .then(...)
  };

  const formatAttendance = (r: number) => `${Math.round(r * 100)}%`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Báo cáo tổng quan chương trình
        </h1>
        <p className="text-sm text-muted-foreground">
          Tạo & tải về bộ dữ liệu tổng thể cho toàn chương trình Tutor/Mentor
          theo học kỳ, khoa, loại chương trình…
        </p>
      </div>

      <Card className="border border-border/60">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">
              Bộ lọc và cấu hình trường báo cáo
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Chọn khoảng thời gian, phạm vi khoa/chương trình và định dạng file xuất.
            </p>
          </div>
          <Settings2 className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hàng 1: Học kỳ + khoảng ngày */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-xs mb-1 font-medium text-muted-foreground">
                Học kỳ
              </label>
              <select
                className="h-9 rounded-md border px-3 text-sm bg-background"
                value={form.semester}
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
                Từ ngày
              </label>
              <input
                type="date"
                className="h-9 rounded-md border px-3 text-sm bg-background"
                value={form.fromDate}
                onChange={(e) => handleChange("fromDate", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs mb-1 font-medium text-muted-foreground">
                Đến ngày
              </label>
              <input
                type="date"
                className="h-9 rounded-md border px-3 text-sm bg-background"
                value={form.toDate}
                onChange={(e) => handleChange("toDate", e.target.value)}
              />
            </div>
          </div>

          {/* Hàng 2: Khoa + loại chương trình */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs mb-1 font-medium text-muted-foreground">
                Khoa / Đơn vị
              </label>
              <select
                className="h-9 rounded-md border px-3 text-sm bg-background"
                value={form.faculty}
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
                Loại chương trình
              </label>
              <select
                className="h-9 rounded-md border px-3 text-sm bg-background"
                value={form.programType}
                onChange={(e) => handleChange("programType", e.target.value)}
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Academic">Academic</option>
                <option value="Non-academic">Non-academic</option>
              </select>
            </div>
          </div>

          {/* Hàng 3: Định dạng output */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-xs mb-1 font-medium text-muted-foreground">
                Định dạng xuất file
              </label>
              <select
                className="h-9 rounded-md border px-3 text-sm bg-background"
                value={form.outputFormat}
                onChange={(e) => handleChange("outputFormat", e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div className="flex gap-2 md:col-span-2 justify-end">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Filter className="h-4 w-4 mr-1" />
                Xem preview
              </Button>
              <Button size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Tải về báo cáo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview dữ liệu tổng quan */}
      <Card className="border border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Preview dữ liệu tổng quan (demo)
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-2">Khoa</th>
                <th className="text-left py-2">Chương trình</th>
                <th className="text-left py-2">Học kỳ</th>
                <th className="text-right py-2">Số phiên</th>
                <th className="text-right py-2">Tỉ lệ điểm danh</th>
                <th className="text-right py-2">Điểm đánh giá TB</th>
              </tr>
            </thead>
            <tbody>
              {mockOverviewData.map((row, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-2 pr-4">{row.faculty}</td>
                  <td className="py-2 pr-4">{row.program}</td>
                  <td className="py-2 pr-4">{row.semester}</td>
                  <td className="py-2 text-right">{row.totalSessions}</td>
                  <td className="py-2 text-right">
                    {formatAttendance(row.attendanceRate)}
                  </td>
                  <td className="py-2 text-right">
                    {row.avgScore.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            * Dữ liệu hiện tại là mock. Khi tích hợp backend, hãy thay bằng dữ liệu thực
            từ UC-K2/K3 trong tài liệu.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
