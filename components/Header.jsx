"use client"; 
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
 
    <header className="fixed top-0 right-0 left-64 h-[61px] bg-[#3C8DBC] flex items-center justify-between px-6 z-20 shadow-md font-sans">
      
      {/* --- BÊN TRÁI: TÊN CHƯƠNG TRÌNH --- */}
      <div className="flex items-center gap-4">
        
      </div>

      {/* --- BÊN PHẢI: USER & NGÔN NGỮ --- */}
      <div className="flex items-center gap-6">
        
        {/* 1. User Info (Avatar + Tên in hoa trắng) */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            {/* Vòng tròn trắng bao quanh avatar */}
            <div className="w-8 h-8 rounded-full bg-white p-[2px] flex items-center justify-center overflow-hidden">
                <img 
                    src={user?.avatar || "https://www.shutterstock.com/image-vector/cute-smiling-teacher-tutor-avatar-260nw-1697507119.jpg"} 
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                />
            </div>
            {/* Tên user: Chữ trắng, In hoa, Đậm */}
            <span className="text-sm font-bold text-white uppercase">
                {user?.name || 'USER NAME'}
            </span>
        </div>

        {/* 2. Cờ Ngôn ngữ (Có gạch dọc ngăn cách) */}
        <div className="flex items-center gap-2 border-l border-white/30 pl-6 h-6">
           {/* Cờ Việt Nam */}
           <button className="hover:scale-110 transition-transform" title="Tiếng Việt">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" 
                alt="VN" 
                className="w-6 h-4 object-cover shadow-sm border border-white/20"
              />
           </button>
           
           {/* Cờ Anh/Úc */}
           <button className="hover:scale-110 transition-transform opacity-70 hover:opacity-100" title="English">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg" 
                alt="EN" 
                className="w-6 h-4 object-cover shadow-sm border border-white/20"
              />
           </button>
        </div>
          
      </div>
      
    </header>
  );
}