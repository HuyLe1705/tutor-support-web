"use client";

import React, { useState } from "react";
import { BarChart3, Users, GraduationCap, CalendarDays } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const semesters = ["HK241", "HK242", "HK251", "HK252"];
const programTypes = ["Tất cả", "Academic", "Non-academic"];

const summaryCards = [
  {
    id: "programs",
    icon: BarChart3,
    label: "Chương trình đang hoạt động",
    value: 4,
    description: "Tổng số loại chương trình Tutor/Mentor đang mở",
  },
  {
    id: "sessions",
    icon: CalendarDays,
    label: "Phiên tư vấn trong kỳ",
    value: 128,
    description: "Tổng số phiên đã được mở trong học kỳ đã chọn",
  },
  {
    id: "tutors",
    icon: GraduationCap,
    label: "Tutor đang tham gia",
    value: 36,
    description: "Số tutor có ít nhất một phiên đang hoạt động",
  },
  {
    id: "mentees",
    icon: Users,
    label: "Mentee đang tham gia",
    value: 420,
    description: "Số sinh viên đã đăng ký chương trình",
  },
];

const facultyStats = [
  { faculty: "Khoa Khoa học & Kỹ thuật Máy tính", programs: 2, tutors: 15, mentees: 180 },
  { faculty: "Khoa Cơ khí", programs: 1, tutors: 10, mentees: 110 },
  { faculty: "Khoa Điện", programs: 1, tutors: 11, mentees: 130 },
];

const recentActivities = [
  {
    time: "Hôm nay 09:15",
    description: "Đã xuất báo cáo tổng quan HK251 cho Phòng Đào tạo (CSV)",
  },
  {
    time: "Hôm qua 16:20",
    description: "Tutor Huỳnh A cập nhật biên bản cho phiên BK-CS350-03",
  },
  {
    time: "Hôm qua 10:05",
    description: "Coordinator Khoa Khoa học máy tính duyệt 15 đăng ký mới",
  },
];

export default function AdminDashboardPage() {
  const [selectedSemester, setSelectedSemester] = useState("HK251");
  const [selectedProgramType, setSelectedProgramType] = useState("Tất cả");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard quản trị chương trình Tutor/Mentor
          </h1>
          <p className="text-sm text-muted-foreground">
            Tổng quan nhanh về hoạt động chương trình theo học kỳ & loại chương trình.
          </p>
        </div>

        {/* Bộ lọc cấp cao */}
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">
              Học kỳ
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="h-9 rounded-md border px-3 text-sm bg-background"
            >
              {semesters.map((hk) => (
                <option key={hk} value={hk}>
                  {hk}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">
              Loại chương trình
            </label>
            <select
              value={selectedProgramType}
              onChange={(e) => setSelectedProgramType(e.target.value)}
              className="h-9 rounded-md border px-3 text-sm bg-background"
            >
              {programTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              size="sm"
              onClick={() => {
                // TODO: gọi API refetch dữ liệu dashboard
                console.log("Refetch dashboard với", {
                  selectedSemester,
                  selectedProgramType,
                });
              }}
            >
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.id} className="border border-border/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.label}
                </CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{card.value}</div>
                <p className="text-xs mt-1 text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Thống kê theo khoa & hoạt động gần đây */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 border border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Phân bố chương trình theo khoa
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left py-2">Khoa</th>
                  <th className="text-right py-2">Số chương trình</th>
                  <th className="text-right py-2">Tutor</th>
                  <th className="text-right py-2">Mentee</th>
                </tr>
              </thead>
              <tbody>
                {facultyStats.map((row) => (
                  <tr key={row.faculty} className="border-b last:border-0">
                    <td className="py-2 pr-4">{row.faculty}</td>
                    <td className="py-2 text-right">{row.programs}</td>
                    <td className="py-2 text-right">{row.tutors}</td>
                    <td className="py-2 text-right">{row.mentees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs text-muted-foreground">{item.time}</p>
                <p className="text-sm">{item.description}</p>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => {
                // TODO: chuyển sang trang log / audit chi tiết nếu cần
              }}
            >
              Xem toàn bộ log báo cáo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
