// app/admin/program-types/page.tsx
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from "lucide-react";

type ProgramType = {
  id: number;
  code: string;
  name: string;
  category: "Academic" | "Non-academic" | "Support";
  scope: "Toàn trường" | "Theo khoa";
  active: boolean;
};

const initialProgramTypes: ProgramType[] = [
  {
    id: 1,
    code: "ACA_Y1",
    name: "Tutor học thuật năm 1",
    category: "Academic",
    scope: "Theo khoa",
    active: true,
  },
  {
    id: 2,
    code: "ACA_CS",
    name: "Tutor chuyên sâu môn CS",
    category: "Academic",
    scope: "Theo khoa",
    active: true,
  },
  {
    id: 3,
    code: "SOFT_SKILL",
    name: "Mentor kỹ năng mềm",
    category: "Support",
    scope: "Toàn trường",
    active: true,
  },
  {
    id: 4,
    code: "WELL_BEING",
    name: "Chương trình hỗ trợ tâm lý",
    category: "Support",
    scope: "Toàn trường",
    active: false,
  },
];

export default function ProgramTypesPage() {
  const [programTypes, setProgramTypes] =
    useState<ProgramType[]>(initialProgramTypes);

  const [newType, setNewType] = useState<Omit<ProgramType, "id">>({
    code: "",
    name: "",
    category: "Academic",
    scope: "Theo khoa",
    active: true,
  });

  const handleChangeNew = (field: keyof typeof newType, value: string | boolean) => {
    setNewType((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdd = () => {
    if (!newType.code.trim() || !newType.name.trim()) {
      alert("Vui lòng nhập mã và tên loại chương trình.");
      return;
    }

    const exists = programTypes.some(
      (t) => t.code.toLowerCase() === newType.code.toLowerCase()
    );
    if (exists) {
      alert("Mã loại chương trình đã tồn tại.");
      return;
    }

    const nextId =
      programTypes.length === 0
        ? 1
        : Math.max(...programTypes.map((t) => t.id)) + 1;

    setProgramTypes((prev) => [
      ...prev,
      {
        id: nextId,
        ...newType,
      },
    ]);

    // Reset form
    setNewType({
      code: "",
      name: "",
      category: "Academic",
      scope: "Theo khoa",
      active: true,
    });
  };

  const handleToggleActive = (id: number) => {
    setProgramTypes((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t
      )
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa loại chương trình này?")) return;
    setProgramTypes((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveAll = () => {
    // TODO: Gọi API lưu cấu hình loại chương trình xuống DB
    console.log("Save program types", programTypes);
    alert("Đã lưu cấu hình (demo). Sau này nối API thật để lưu vào DB.");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Định nghĩa loại chương trình
        </h1>
        <p className="text-sm text-muted-foreground">
          Quản lý danh mục các loại chương trình Tutor/Mentor dùng chung cho
          đăng ký & báo cáo (UC-G1).
        </p>
      </div>

      {/* Form thêm loại mới */}
      <Card className="border border-border/60">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold">
              Thêm loại chương trình mới
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Đặt mã ngắn gọn, tên dễ hiểu; chọn nhóm (Academic / Non-academic / Support)
              và phạm vi áp dụng.
            </p>
          </div>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col">
            <label className="text-xs mb-1 font-medium text-muted-foreground">
              Mã loại
            </label>
            <input
              className="h-9 rounded-md border px-3 text-sm bg-background"
              placeholder="Ví dụ: ACA_Y1"
              value={newType.code}
              onChange={(e) => handleChangeNew("code", e.target.value)}
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-xs mb-1 font-medium text-muted-foreground">
              Tên loại chương trình
            </label>
            <input
              className="h-9 rounded-md border px-3 text-sm bg-background"
              placeholder="Ví dụ: Tutor học thuật năm 1"
              value={newType.name}
              onChange={(e) => handleChangeNew("name", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs mb-1 font-medium text-muted-foreground">
              Nhóm
            </label>
            <select
              className="h-9 rounded-md border px-3 text-sm bg-background"
              value={newType.category}
              onChange={(e) =>
                handleChangeNew("category", e.target.value as ProgramType["category"])
              }
            >
              <option value="Academic">Academic</option>
              <option value="Non-academic">Non-academic</option>
              <option value="Support">Support</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs mb-1 font-medium text-muted-foreground">
              Phạm vi
            </label>
            <select
              className="h-9 rounded-md border px-3 text-sm bg-background"
              value={newType.scope}
              onChange={(e) =>
                handleChangeNew("scope", e.target.value as ProgramType["scope"])
              }
            >
              <option value="Toàn trường">Toàn trường</option>
              <option value="Theo khoa">Theo khoa</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách loại chương trình */}
      <Card className="border border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Danh sách loại chương trình (demo)
          </CardTitle>
          <Button size="sm" variant="outline" onClick={handleSaveAll}>
            <Save className="h-4 w-4 mr-1" />
            Lưu cấu hình
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-2 px-2">Mã</th>
                <th className="text-left py-2 px-2">Tên loại</th>
                <th className="text-left py-2 px-2">Nhóm</th>
                <th className="text-left py-2 px-2">Phạm vi</th>
                <th className="text-center py-2 px-2">Kích hoạt</th>
                <th className="text-right py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {programTypes.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-2 px-2 align-top font-mono">{t.code}</td>
                  <td className="py-2 px-2 align-top">{t.name}</td>
                  <td className="py-2 px-2 align-top">
                    {t.category === "Academic"
                      ? "Academic"
                      : t.category === "Non-academic"
                      ? "Non-academic"
                      : "Support (hỗ trợ)"}
                  </td>
                  <td className="py-2 px-2 align-top">{t.scope}</td>
                  <td className="py-2 px-2 align-top text-center">
                    <input
                      type="checkbox"
                      checked={t.active}
                      onChange={() => handleToggleActive(t.id)}
                    />
                  </td>
                  <td className="py-2 px-2 align-top text-right">
                    <button
                      className="inline-flex items-center text-xs text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {programTypes.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 text-center text-xs text-muted-foreground"
                  >
                    Chưa có loại chương trình nào. Hãy thêm mới ở phía trên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            * Sau khi lưu cấu hình, các loại chương trình này sẽ được dùng trong:
            đăng ký chương trình, lọc báo cáo và thống kê tổng quan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
