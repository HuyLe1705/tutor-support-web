"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  // Icon điều hướng & Hệ thống
  LayoutDashboard, LogOut, ChevronDown, ChevronRight, Shield, Settings, Database,
  // Icon chức năng chung
  User, Users, Calendar, BarChart3, Bell, FileText, Search, HelpCircle,
  // Icon hành động
  PenTool, CheckSquare, RefreshCw, XCircle, MessageSquare, TrendingUp, BookOpen,UserCircle
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // --- 1. STATE QUẢN LÝ NHIỀU MENU CON ---
  // Thay vì chỉ true/false, ta dùng object để lưu trạng thái từng menu theo label
  // Ví dụ: { 'Hồ sơ mở rộng': true, 'Chương trình tutor-mentee': false }
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label] // Đảo ngược trạng thái của menu được click
    }));
  };

  // Tự động mở menu cha nếu đang ở trang con
  useEffect(() => {
    const newOpenState = {};
    
    // Logic cho Tutor (Giữ nguyên)
    if (pathname.includes('/dashboard/schedule') || pathname.includes('/dashboard/session')) {
        newOpenState['Thiết lập & Quản lý phiên'] = true;
    }

    // Logic cho Student (Mới)
    if (pathname.includes('/dashboard/student/profile')) {
        newOpenState['Hồ sơ mở rộng'] = true;
    }
    if (pathname.includes('/dashboard/student/tutor-mentee')) {
        newOpenState['Chương trình tutor-mentee'] = true;
    }

    setOpenMenus(prev => ({ ...prev, ...newOpenState }));
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getNavItems = () => {
    const role = user?.role;
    
    const commonGroup = {
      title: null,
      items: [
        { label: 'Báo cáo tổng quan', href: '/dashboard', icon: LayoutDashboard, exact: true, type: 'link' },
      ]
    };

    // --- CẤU TRÚC MENU SINH VIÊN (Dựa trên ảnh bạn gửi) ---
    const studentGroup = {
        title: null, // Không cần tiêu đề nhóm
        items: [
             // 1. Hồ sơ mở rộng (Dropdown)
             { 
                 label: 'Hồ sơ mở rộng', 
                 icon: UserCircle, 
                 type: 'dropdown',
                 items: [
                     { label: 'Cập nhật hồ sơ mở rộng', href: '/dashboard/student/profile/update' },
                     { label: 'Thêm mới hồ sơ mở rộng', href: '/dashboard/student/profile/create' },
                     { label: 'Xem hồ sơ mở rộng', href: '/dashboard/student/profile/view' },
                 ]
             },
             // 2. Chương trình tutor-mentee (Dropdown)
             {
                 label: 'Chương trình tutor-mentee',
                 icon: Users,
                 type: 'dropdown',
                 items: [
                     
                      { label: 'Đăng kí chương trình', href: '/dashboard/student/register', icon: PenTool, type: 'link' },
                      { label: 'Đăng ký của tôi', href: '/dashboard/student/my-registration', icon: CheckSquare, type: 'link' },
                      { label: 'Tìm kiếm Tutor/Phiên', href: '/dashboard/student/search', icon: Search, type: 'link' },
                      { label: 'Đặt chỗ phiên', href: '/dashboard/student/booking', icon: Calendar, type: 'link' },
                      { label: 'Đổi lịch', href: '/dashboard/student/reschedule', icon: RefreshCw, type: 'link' },
                      { label: 'Hủy chỗ', href: '/dashboard/student/cancel', icon: XCircle, type: 'link' },
                      { label: 'Cấu hình thông báo', href: '/dashboard/student/notifications', icon: Bell, type: 'link' },
                      { label: 'Phản hồi & Đánh giá', href: '/dashboard/student/feedback', icon: MessageSquare, type: 'link' },
                      { label: 'Tiến độ học tập', href: '/dashboard/student/progress', icon: TrendingUp, type: 'link' },
                      { label: 'Tài liệu học tập', href: '/dashboard/student/materials', icon: BookOpen, type: 'link' },
                      { label: 'Hỏi đáp', href: '/dashboard/student/qa', icon: HelpCircle, type: 'link' },
                      { label: 'Cá nhân hóa', href: '/dashboard/student/personalization', icon: Settings, type: 'link' }
                              ]
             },
             // 3. Các mục đơn khác
             { label: 'Phản hồi và đánh giá', href: '/dashboard/student/feedback', icon: MessageSquare, type: 'link' },
             { label: 'Tiến độ học tập', href: '/dashboard/student/progress', icon: BarChart3, type: 'link' },
             { label: 'Báo cáo', href: '/dashboard/student/report', icon: FileText, type: 'link' },
             { label: 'Tài liệu học tập', href: '/dashboard/student/materials', icon: BookOpen, type: 'link' },
             { label: 'Không gian hỏi đáp', href: '/dashboard/student/qa', icon: HelpCircle, type: 'link' },
             { label: 'Cá nhân hóa học tập', href: '/dashboard/student/personalization', icon: Settings, type: 'link' },
             { label: 'Cấu hình thông báo', href: '/dashboard/student/notifications', icon: Bell, type: 'link' },
        ]
    }

    const tutorGroup = {
      items: [
        { label: 'Hồ sơ mở rộng', 
          icon: UserCircle, 
          type: 'dropdown',
          items: [
              { label: 'Cập nhật hồ sơ mở rộng', href: '/dashboard/student/profile/update' },
              { label: 'Thêm mới hồ sơ mở rộng', href: '/dashboard/student/profile/create' },
              { label: 'Xem hồ sơ mở rộng', href: '/dashboard/student/profile/view' },
          ]},
        {
            label: 'Thiết lập & Quản lý phiên',
            icon: Calendar,
            type: 'dropdown', 
            items: [
                { label: 'Thiết lập lịch rảnh', href: '/dashboard/schedule' },
                { label: 'Quản lý phiên', href: '/dashboard/session' },
                { label: 'Duyệt tham gia phiên', href: '/dashboard/approve' },
                { label: 'Điểm danh', href: '/dashboard/attendance' },
            ]
        },
        { label: 'Báo cáo tổng quan', href: '/dashboard/report', icon: BarChart3, type: 'link' }
      ]
    };

    const adminGroup = {
      title: 'Quản trị',
      items: [
        // 1. Hồ sơ mở rộng (Dropdown)
        { 
            label: 'Hồ sơ mở rộng', 
            icon: UserCircle, 
            type: 'dropdown',
            items: [
                { label: 'Cập nhật hồ sơ mở rộng', href: '/dashboard/student/profile/update' },
                { label: 'Thêm mới hồ sơ mở rộng', href: '/dashboard/student/profile/create' },
                { label: 'Xem hồ sơ mở rộng', href: '/dashboard/student/profile/view' },
            ]
        },
        // 2. Chương trình tutor-mentee (Dropdown)
        {
            label: 'Chương trình tutor-mentee',
            icon: Users,
            type: 'dropdown',
            items: [
                { label: 'Quản lý đăng ký', href: '/dashboard/student/tutor-mentee/register' },
                { label: 'Quản lý ghép cặp', href: '/dashboard/student/tutor-mentee/pairing' },
                { label: 'Xem danh sách mentee của phiên', href: '/dashboard/student/tutor-mentee/list' },
                { label: 'Xem biên bản', href: '/dashboard/student/tutor-mentee/minutes' },
            ]
        },
        // 3. Các mục đơn khác
        { label: 'Phản hồi và đánh giá', href: '/dashboard/student/feedback', icon: MessageSquare, type: 'link' },
        { label: 'Tiến độ học tập', href: '/dashboard/student/progress', icon: BarChart3, type: 'link' },
        { label: 'Báo cáo', href: '/dashboard/student/report', icon: FileText, type: 'link' },
        { label: 'Tài liệu học tập', href: '/dashboard/student/materials', icon: BookOpen, type: 'link' },
        { label: 'Không gian hỏi đáp', href: '/dashboard/student/qa', icon: HelpCircle, type: 'link' },
        { label: 'Cá nhân hóa học tập', href: '/dashboard/student/personalization', icon: Settings, type: 'link' },
        { label: 'Cấu hình thông báo', href: '/dashboard/student/notifications', icon: Bell, type: 'link' },
      ]
    };

    if (role === 'student') return [studentGroup]; // Chỉ hiện nhóm student
    if (role === 'tutor') return [tutorGroup]; 
    if (role === 'mixed') return [studentGroup, tutorGroup];
    if (role === 'admin') return [adminGroup];
    
    return [commonGroup];
  };

  const navGroups = getNavItems();

  return (
    <aside className="w-64 bg-[#222D32] text-white min-h-screen flex flex-col fixed left-0 top-0 h-full z-20 shadow-xl font-sans">
      
      {/* HEADER */}
      <div className="h-[60px] flex items-center justify-center px-4 bg-[#367FA9] shadow-md flex-shrink-0">
        <div className="leading-tight text-white text-center">
            <h1 className="font-bold text-[13px] uppercase tracking-wide">Tutor Program</h1>
        </div>
      </div>

      {/* USER INFO */}
      <div className="px-4 py-6 bg-[#222D32] border-b border-gray-700/50 flex items-center gap-3 flex-shrink-0">
         <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold border-2 border-gray-500 text-white overflow-hidden">
             {user?.avatar ? <img src={user.avatar} alt="User" /> : (user?.name?.charAt(0) || 'U')}
         </div>
         <div className="overflow-hidden">
             <p className="font-bold text-sm text-white truncate w-36 uppercase">
                {user?.name || 'USER NAME'}
             </p>
             <span className="text-[10px] text-gray-400 block mt-1">
                {user?.department || 'Guest'}
             </span>
         </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 py-2 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-2">
            {group.title && (
              <div className="px-5 py-2 mt-2 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                {group.title}
              </div>
            )}
            
            <div className="space-y-[2px]"> 
                {group.items.map((item, index) => {
                    
                    // --- TRƯỜNG HỢP 1: MENU XỔ XUỐNG (ACCORDION) ---
                    if (item.type === 'dropdown') {
                        // Kiểm tra trạng thái mở dựa trên label của item
                        const isOpen = openMenus[item.label] || false;
                        const isChildActive = item.items.some(sub => pathname.startsWith(sub.href));
                        
                        return (
                            <div key={index}>
                                {/* Nút cha */}
                                <button
                                    onClick={() => toggleMenu(item.label)} // SỬ DỤNG toggleMenu
                                    className={`w-full flex items-center justify-between px-5 py-3 text-[13px] transition-colors duration-150 border-l-[3px]
                                    ${isOpen || isChildActive 
                                        ? 'bg-[#1E282C] text-white border-transparent' 
                                        : 'text-gray-400 hover:bg-[#1E282C] hover:text-gray-200 border-transparent'
                                    }`}
                                >
                                    <div className="font-medium">
                                        {item.label}
                                    </div>
                                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>

                                {/* Danh sách con */}
                                {isOpen && (
                                    <div className="bg-[#2C3B41]">
                                        {item.items.map((subItem, subIndex) => {
                                            const isSubActive = pathname === subItem.href;
                                            return (
                                                <Link
                                                    key={subIndex}
                                                    href={subItem.href}
                                                    className={`block pl-8 pr-4 py-2 text-[12px] transition-colors
                                                    ${isSubActive 
                                                        ? 'text-white font-bold' 
                                                        : 'text-[#8aa4af] hover:text-white'
                                                    }`}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // --- TRƯỜNG HỢP 2: MENU LINK BÌNH THƯỜNG ---
                    const isActive = item.exact 
                        ? pathname === item.href 
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center px-5 py-3 text-[13px] transition-colors duration-150
                                ${isActive 
                                ? 'bg-[#1E282C] text-white font-medium border-l-[3px] border-[#007ACC]' 
                                : 'text-gray-400 hover:bg-[#1E282C] hover:text-gray-200 border-l-[3px] border-transparent'
                                }
                            `}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
          </div>
        ))}
      </nav>
      
      {/* LOGOUT */}
      <div className="p-4 bg-[#222D32] border-t border-gray-700/50 flex-shrink-0">
        <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
        >
            Đăng xuất
        </button>
      </div>
    </aside>
  );
}