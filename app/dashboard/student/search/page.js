"use client";

import Header from '@/components/Header';
import { Search, Filter, MapPin, Star, Users, Clock, Heart, ChevronDown, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

// --- MOCK DATA ---
const MOCK_TUTORS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    subject: "Lập trình Web, React",
    rating: 4.8,
    sessions_count: 45,
    location: "Online",
    bio: "Có 5 năm kinh nghiệm giảng dạy và làm việc với React/Node.js",
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff",
  },
  {
    id: 2,
    name: "Trần Thị B",
    subject: "Machine Learning, Python",
    rating: 4.9,
    sessions_count: 62,
    location: "CS1, Tầng 3",
    bio: "Chuyên gia ML với nhiều dự án thực tế",
    avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random&color=fff",
  }
];

const MOCK_UPCOMING_SESSIONS = [
  {
    id: 101,
    title: "Nhập môn React Hooks",
    tutor: "Nguyễn Văn A",
    timeStr: "14:00 - 16:00, 05/11/2025",
    date: "2025-11-05", 
    slots: "3/10",
    location: "Online",
    type: "Nhóm",
  },
  {
    id: 102,
    title: "Python cho Data Science",
    tutor: "Trần Thị B",
    timeStr: "09:00 - 11:00, 07/11/2025",
    date: "2025-11-07",
    slots: "5/15",
    location: "CS1, Phòng 301",
    type: "Nhóm",
  },
  {
    id: 103,
    title: "Luyện thi Giải tích 1",
    tutor: "Lê Hoàng Trợ Giảng",
    timeStr: "07:00 - 09:00, 08/11/2025",
    date: "2025-11-08",
    slots: "1/5",
    location: "Thư viện",
    type: "1-1",
  }
];

export default function StudentSearchPage() {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [likedTutors, setLikedTutors] = useState([]);
  const [likesLoaded, setLikesLoaded] = useState(false);

  // State 1: Danh sách phiên đã đăng ký
  const [registeredList, setRegisteredList] = useState([]);
  
  // State 2: Danh sách ID Tutor đã gửi yêu cầu ghép cặp [MỚI]
  const [requestedTutorIds, setRequestedTutorIds] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const toggleLikeTutor = (id) => {
    setLikedTutors(prev => {
        if (prev.includes(id)) {
            return prev.filter(x => x !== id);
        }
        return [...prev, id];
    });
};

    useEffect(() => {
    const savedLikes = localStorage.getItem("liked_tutors");
    if (savedLikes) setLikedTutors(JSON.parse(savedLikes));
    setLikesLoaded(true);
    }, []);
    
    useEffect(() => {
        if (!likesLoaded) return;
        localStorage.setItem("liked_tutors", JSON.stringify(likedTutors));
    }, [likedTutors, likesLoaded]);
    
  // --- EFFECT: LOAD DATA ---
  useEffect(() => {
    // Load danh sách đăng ký phiên
    const savedReg = localStorage.getItem('student_registrations');
    if (savedReg) setRegisteredList(JSON.parse(savedReg));

    // Load danh sách yêu cầu ghép cặp [MỚI]
    const savedReq = localStorage.getItem('pairing_requests');
    if (savedReq) setRequestedTutorIds(JSON.parse(savedReq));

    setIsLoaded(true);
  }, []);

  // --- EFFECT: SAVE DATA ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('student_registrations', JSON.stringify(registeredList));
      localStorage.setItem('pairing_requests', JSON.stringify(requestedTutorIds)); // Lưu request [MỚI]
    }
  }, [registeredList, requestedTutorIds, isLoaded]);
  
  // --- HANDLER: ĐĂNG KÝ PHIÊN ---
  const handleRegister = (session) => {
    const isExist = registeredList.find(item => item.id === session.id);
    if (isExist) {
        alert("Bạn đã đăng ký phiên này rồi!");
        return;
    }
    const newItem = {
        ...session,
        regDate: new Date().toISOString(),
        status: "Đang chờ duyệt"
    };
    setRegisteredList(prev => [...prev, newItem]);
    alert(`Đăng ký thành công phiên: ${session.title}`);
  };

  const handleCancelRegistration = (id) => {
    if(confirm("Bạn có chắc muốn hủy đăng ký phiên này?")) {
        setRegisteredList(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- HANDLER: YÊU CẦU GHÉP CẶP (MỚI) ---
  
  // 1. Gửi yêu cầu
  const handlePairingRequest = (tutorId, tutorName) => {
      setRequestedTutorIds(prev => [...prev, tutorId]);
      alert(`Đã gửi yêu cầu ghép cặp tới: ${tutorName}`);
  }

  // 2. Hủy yêu cầu
  const handleCancelPairing = (tutorId) => {
      if(confirm("Bạn muốn hủy yêu cầu ghép cặp này?")) {
          setRequestedTutorIds(prev => prev.filter(id => id !== tutorId));
      }
  }

  // --- LOGIC SEARCH & FILTER ---
  const filteredSessions = MOCK_UPCOMING_SESSIONS.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.tutor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTutors = MOCK_TUTORS.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDayOfWeek = (dateStr) => {
    if(!dateStr) return "T2"; 
    const date = new Date(dateStr);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-sm text-gray-700">
      <Header title="Đăng ký Tutor" />

      <main className="pt-[80px] p-4 md:ml-64 transition-all duration-300 max-w-6xl mx-auto">
        
        {/* --- SECTION 1: SEARCH & FILTER --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3 border-b pb-2">Tìm kiếm Tutor và phiên</h2>
            
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nhập tên Phiên hoặc tên Tutor..." 
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
                <button 
                    onClick={() => setShowFilter(!showFilter)}
                    className={`px-4 py-2 text-gray-700 rounded-md flex items-center gap-2 border border-gray-300 transition-colors
                        ${showFilter ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                >
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                </button>
            </div>

            {showFilter && (
                <div className="bg-gray-50 p-4 rounded-md animate-fade-in-down">
                    {/* ... (Phần nội dung bộ lọc giữ nguyên) ... */}
                     <div className="flex justify-center mb-4"><h3 className="text-lg font-medium text-gray-700">Bộ lọc nâng cao</h3></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="relative"><select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none cursor-pointer"><option value="">Thời gian</option></select><ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/></div>
                            <div className="relative"><select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none cursor-pointer"><option value="">Loại phiên</option></select><ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/></div>
                        </div>
                        <div className="space-y-4">
                             <div className="relative"><select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none cursor-pointer"><option value="">Địa điểm</option></select><ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/></div>
                             <div className="relative"><select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none cursor-pointer"><option value="">Đánh giá</option></select><ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/></div>
                        </div>
                    </div>
                    <div className="text-center mt-4"><button onClick={() => setSearchTerm("")} className="text-blue-500 text-sm hover:underline">Xóa bộ lọc</button></div>
                </div>
            )}
        </div>

        {/* --- SECTION 2: DANH SÁCH TUTOR (ĐÃ CẬP NHẬT LOGIC NÚT) --- */}
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách Tutor gợi ý</h2>
            <div className="space-y-4">
                {filteredTutors.length === 0 ? <p className="text-gray-500 italic">Không tìm thấy Tutor phù hợp.</p> : 
                filteredTutors.map((tutor) => {
                    // Kiểm tra xem tutor này đã được yêu cầu chưa
                    const isRequested = requestedTutorIds.includes(tutor.id);

                    return (
                        <div key={tutor.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0">
                                <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-md object-cover bg-gray-200" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{tutor.name}</h3>
                                        <p className="text-gray-500 mb-2">{tutor.subject}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                            <span className="flex items-center gap-1 text-yellow-500 font-medium"><Star className="w-3 h-3 fill-current" /> {tutor.rating}</span>
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {tutor.sessions_count} phiên</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {tutor.location}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm italic line-clamp-2">{tutor.bio}</p>
                                    </div>
                                    
                                    {/* --- LOGIC HIỂN THỊ NÚT GHÉP CẶP --- */}
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            {isRequested ? (
                                                // TRẠNG THÁI: ĐÃ YÊU CẦU
                                                <div className="flex items-center gap-2 animate-fade-in">
                                                    <button 
                                                        disabled
                                                        className="bg-gray-100 text-gray-500 border border-gray-200 px-3 py-2 rounded-md font-medium text-xs flex items-center gap-1 cursor-default"
                                                    >
                                                        <CheckCircle className="w-3 h-3" />
                                                        Đã yêu cầu
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancelPairing(tutor.id)}
                                                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md font-medium text-xs flex items-center gap-1 transition-colors"
                                                    >
                                                        <XCircle className="w-3 h-3" />
                                                        Hủy
                                                    </button>
                                                </div>
                                            ) : (
                                                // TRẠNG THÁI: CHƯA YÊU CẦU
                                                <button 
                                                    onClick={() => handlePairingRequest(tutor.id, tutor.name)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm shadow-blue-200"
                                                >
                                                    Gửi yêu cầu ghép cặp
                                                </button>
                                            )}
                                            
                                            <button 
                                                    onClick={() => toggleLikeTutor(tutor.id)}
                                                    className="transition-colors"
                                                >
                                                    <Heart
                                                        className={`w-5 h-5 ${
                                                            likedTutors.includes(tutor.id)
                                                                ? "text-red-500 fill-red-500" 
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* --- SECTION 3: PHIÊN SẮP DIỄN RA --- */}
        <div className="mb-8 pt-4 border-t border-blue-200">
             <h2 className="text-xl font-bold text-gray-800 mb-4 mt-2">Phiên Sắp Diễn Ra</h2>
             <div className="space-y-4">
                {filteredSessions.length === 0 ? <p className="text-gray-500 italic">Không tìm thấy phiên học nào.</p> :
                filteredSessions.map((session) => {
                    const isRegistered = registeredList.some(r => r.id === session.id);
                    return (
                        <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:border-blue-300 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-md font-bold text-gray-800">{session.title}</h3>
                                    <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full border border-blue-200">{session.type}</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">Tutor: <span className="font-medium text-gray-700">{session.tutor}</span></p>
                                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500"><span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {session.timeStr}</span><span className="flex items-center gap-1"><Users className="w-3 h-3"/> {session.slots}</span><span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {session.location}</span></div>
                            </div>
                            <button onClick={() => handleRegister(session)} disabled={isRegistered} className={`px-6 py-2 rounded-md font-medium text-sm transition-colors shadow-sm min-w-[120px] ${isRegistered ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}>{isRegistered ? 'Đã đăng ký' : 'Đăng ký'}</button>
                        </div>
                    );
                })}
             </div>
        </div>

        {/* --- SECTION 4: BẢNG "PHIẾU ĐĂNG KÝ" --- */}
        <div className="mb-10 animate-fade-in-up">
            <h3 className="text-gray-600 mb-2 font-medium">Phiếu đăng ký của tôi</h3>
            <div className="border border-gray-300 bg-white">
                <div className="bg-[#00c0ef] text-white px-3 py-2 text-sm font-bold border-b border-gray-300 flex justify-between items-center">
                    <span>Danh sách đã đăng ký ({registeredList.length})</span>
                    <button onClick={() => {if(confirm("Xóa toàn bộ đăng ký?")) setRegisteredList([])}} className="text-xs text-white/80 hover:text-white underline">Reset</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-200 text-gray-700">
                                <th className="p-2 w-10 border-r text-center">#</th>
                                <th className="p-2 border-r min-w-[200px]">Chi tiết Phiên</th>
                                <th className="p-2 border-r w-[100px]">Trạng thái</th>
                                <th className="p-2 border-r">Giảng viên</th>
                                <th className="p-2 border-r">Địa điểm</th>
                                <th className="p-2 border-r w-[80px]">Nhóm</th>
                                <th className="p-2 w-[40px] text-center">Hủy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registeredList.length === 0 ? (<tr className="h-16"><td colSpan={7} className="text-center text-gray-400 italic">Chưa đăng ký phiên nào.</td></tr>) : (registeredList.map((item, index) => (
                                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-2 border-r text-center">{index + 1}</td>
                                    <td className="p-2 border-r"><div className="font-bold text-gray-800 text-[13px]">{item.title}</div><div className="grid grid-cols-5 gap-1 text-[10px] text-gray-500 mt-1"><div className="flex flex-col"><span className="italic font-bold">Thứ</span><span>{getDayOfWeek(item.date)}</span></div><div className="flex flex-col"><span className="italic font-bold">Thời gian</span><span>{item.timeStr.split(',')[0]}</span></div><div className="flex flex-col"><span className="italic font-bold">Phòng</span><span>{item.location}</span></div><div className="flex flex-col"><span className="italic font-bold">CS</span><span>CS1</span></div><div className="flex flex-col"><span className="italic font-bold">Ngày</span><span>{item.date}</span></div></div></td>
                                    <td className="p-2 border-r font-medium text-orange-500">Đăng ký mới</td>
                                    <td className="p-2 border-r font-medium">{item.tutor}</td>
                                    <td className="p-2 border-r">{item.location}</td>
                                    <td className="p-2 border-r">{item.type}</td>
                                    <td className="p-2 text-center"><button onClick={() => handleCancelRegistration(item.id)} className="text-red-400 hover:text-red-600 p-1" title="Hủy đăng ký"><Trash2 className="w-4 h-4" /></button></td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}