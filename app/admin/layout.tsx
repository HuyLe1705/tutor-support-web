"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Layers,
  ShieldCheck,
  History, 
} from "lucide-react";

const adminNav = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Báo cáo tổng quan",
    href: "/admin/reports/overview",
    icon: FileText,
  },
  {
    label: "Báo cáo tiến độ",
    href: "/admin/reports/progress",
    icon: BarChart3,
  },
  {
    label: "Loại chương trình",
    href: "/admin/program-types",
    icon: Layers,
  },
  {
    label: "Ánh xạ Role - Permission",      // 🌊 UC-N1
    href: "/admin/rbac/role-permission",
    icon: ShieldCheck,
  },
  {
    label: "Rollback quyền",              // 🌊 UC-N2
    href: "/admin/rbac/rollback",
    icon: History,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* 🌊 Sidebar với màu xanh BK */}
      <aside className="hidden md:flex md:flex-col w-64 bg-bk-blue text-white">
        {/* Header sidebar */}
        <div className="h-16 border-b border-white flex items-center px-4">
          {/* Logo nhỏ Bách Khoa */}
          <div className="h-9 w-9  bg-white/10 flex items-center justify-center overflow-hidden mr-2">
            <Image
              src="https://lms.hcmut.edu.vn/pluginfile.php/3/theme_academi/logo/1761124161/logoBK.png"   // đổi path nếu logo bạn nằm chỗ khác
              alt="Logo Bách Khoa"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Admin Tutor–Mentee
            </span>
            <span className="text-xs text-white/70">
              Bách Khoa HCMUT
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-2 px-4 py-2 text-sm transition-colors rounded-r-full mr-2",
                  active
                    ? "bg-white text-bk-blue shadow-sm"
                    : "text-white/90 hover:bg-white/10",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="border-t border-white/10 px-4 py-3 text-xs text-white/70">
          HK251 · Admin
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 min-w-0">
        {/* Topbar mobile */}
        <div className="md:hidden h-12 border-b flex items-center px-4 bg-bk-blue text-white">
          <span className="text-sm font-semibold">Admin Tutor–Mentee</span>
        </div>

        {/* Nền trang hơi pha xanh BK */}
        <div className="p-4 md:p-6 bg-gradient-to-br from-bk-blue-soft/60 via-slate-50 to-white min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
