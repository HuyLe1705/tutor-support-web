"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Lấy thông tin user
import { LayoutDashboard, UserCircle, Calendar, Users, FileText, BookOpen, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Lấy user từ context

  // Định nghĩa menu cho từng role
  const getNavItems = () => {
    const role = user?.role;

    const commonItems = [
      { label: 'Báo cáo tổng quan', href: '/dashboard', icon: LayoutDashboard },
    ];

    const studentItems = [
      { label: 'Đăng ký chương trình', href: '/dashboard/register', icon: BookOpen },
      { label: 'Đăng ký của tôi', href: '/dashboard/my-registration', icon: FileText },
    ];

    const tutorItems = [
      { label: 'Hồ sơ mở rộng', href: '/dashboard/profile', icon: UserCircle },
      { label: 'Thiết lập lịch rảnh', href: '/dashboard/schedule', icon: Calendar },
      { label: 'Quản lý phiên', href: '/dashboard/session', icon: Users },
      { label: 'Điểm danh', href: '/dashboard/attendance', icon: FileText },
    ];

    if (role === 'student') return [...commonItems, ...studentItems];
    if (role === 'tutor') return [...commonItems, ...tutorItems];
    if (role === 'mixed') return [...commonItems, ...studentItems, ...tutorItems]; // Mixed thấy hết
    //if (role === 'admin') return [...commonItems, { label: 'Quản trị hệ thống', href: '/dashboard/admin', icon: Users }];
    
    return commonItems; // Mặc định
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-[#2C3E50] text-white min-h-screen flex flex-col fixed left-0 top-0 h-full z-10">
      <div className="p-4 border-b border-gray-700 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">BK</div>
        <div>
          <h1 className="font-bold text-sm">TUTOR PROGRAM</h1>
          <p className="text-[10px] text-gray-400">Khoa KH&KT Máy Tính</p>
        </div>
      </div>

      <div className="p-4 border-b border-gray-700">
        <p className="text-xs text-gray-400 uppercase mb-1">Đang đăng nhập</p>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                {user?.avatar || 'G'}
            </div>
            <div>
                <p className="font-semibold text-sm">{user?.name || 'Guest'}</p>
                <p className="text-[10px] text-blue-300 capitalize">{user?.role || 'Guest'}</p>
            </div>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm transition-colors ${
                isActive ? 'bg-[#34495E] border-l-4 border-blue-500' : 'hover:bg-[#34495E] text-gray-300'
              }`}
            >
              <Icon size={18} className="mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded transition-colors"
        >
            <LogOut size={18} className="mr-3" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}