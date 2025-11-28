// File: app/dashboard/layout.js
"use client";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header'; // Thanh header xanh

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#ECF0F5]">
      
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Header cố định bên trên */}
      <Header />

      {/* 3. NỘI DUNG CHÍNH (Được đẩy xuống và sang phải) */}
      {/* ml-64: Chừa chỗ cho Sidebar (256px) */}
      {/* pt-[60px]: Chừa chỗ cho Header xanh (60px) */}
      <main className="ml-64 pt-[60px]">
        {children} 
        {/* 'children' ở đây chính là nội dung file app/dashboard/page.js */}
      </main>

    </div>
  );
}


