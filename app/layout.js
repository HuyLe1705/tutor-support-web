import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext"; // Import Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BK Tutor Program",
  description: "Hệ thống hỗ trợ Tutor HCMUT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>  {/* Bọc toàn bộ app */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}