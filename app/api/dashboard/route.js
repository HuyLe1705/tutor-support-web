// app/api/dashboard/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  // GIẢ LẬP ĐỘ TRỄ MẠNG (Simulate Network Delay) - Để thấy hiệu ứng Loading
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Dữ liệu này sau này sẽ query từ SQL/Database
  const chartData = [
    { month: '12/2024', value: 12 },
    { month: '01/2025', value: 45 }, // Tháng cao điểm
    { month: '02/2025', value: 10 },
    { month: '03/2025', value: 8 },
    { month: '04/2025', value: 10 },
    { month: '05/2025', value: 15 },
    { month: '06/2025', value: 10 },
    { month: '07/2025', value: 5 },
    { month: '08/2025', value: 18 },
    { month: '09/2025', value: 8 },
    { month: '10/2025', value: 10 },
    { month: '11/2025', value: 32 },
  ];

  // Tính tổng số lượt login
  const totalLogins = chartData.reduce((acc, curr) => acc + curr.value, 0);

  // Lấy thời gian hiện tại làm "Lần đăng nhập cuối"
  const lastLogin = new Date().toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }); // Kết quả: "25/11/2025 21:42:44"

  return NextResponse.json({
    chartData,
    summary: {
      lastLogin: lastLogin, // Trả về thời gian thực
      totalLogins: totalLogins // Trả về tổng đã tính toán
    }
  });
}