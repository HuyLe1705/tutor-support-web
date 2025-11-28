"use client";

import Header from '@/components/Header';
import { Search, Filter, MapPin, Star, Users, Heart, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
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

export default function StudentSearchPage() {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [likedTutors, setLikedTutors] = useState([]);
  const [likesLoaded, setLikesLoaded] = useState(false);

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
    // Load danh sách yêu cầu ghép cặp [MỚI]
    const savedReq = localStorage.getItem('pairing_requests');
    if (savedReq) setRequestedTutorIds(JSON.parse(savedReq));

    setIsLoaded(true);
  }, []);

  // --- EFFECT: SAVE DATA ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pairing_requests', JSON.stringify(requestedTutorIds)); // Lưu request [MỚI]
    }
  }, [requestedTutorIds, isLoaded]);

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
  const filteredTutors = MOCK_TUTORS.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-sm text-gray-700">
      <Header title="Tìm kiếm Tutor" />

      <main className="pt-[80px] p-4 md:ml-64 transition-all duration-300 max-w-6xl mx-auto">
        
        {/* --- SECTION 1: SEARCH & FILTER --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3 border-b pb-2">Tìm kiếm Tutor</h2>
            
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nhập tên Tutor hoặc môn học..." 
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
                <button 
                    onClick={() => setShowFilter(!showFilter)}
                    className={`px-4 py-2 text-gray-700 rounded-md flex items-center gap-2 border border-gray-300 transition-colors
                        ${showFilter ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                </button>
            </div>

            {showFilter && (
                <div className="bg-gray-50 p-4 rounded-md animate-fade-in-down">
                    <div className="flex justify-center mb-4"><h3 className="text-lg font-medium text-gray-700">Bộ lọc nâng cao</h3></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="relative"><select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none cursor-pointer"><option value="">Thời gian</option></select><ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/></div>
                            <div className="relative"><select className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none cursor-pointer"><option value="">Loại môn học</option></select><ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/></div>
                        </div>
                    </div>
                    <div className="text-center mt-4"><button onClick={() => setSearchTerm("")} className="text-blue-500 text-sm hover:underline">Xóa bộ lọc</button></div>
                </div>
            )}
        </div>

        {/* --- SECTION 2: DANH SÁCH TUTOR --- */}
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
                                    
                                    <div className="flex flex-col items-end gap-2">
                                        {isRequested ? (
                                            // Nếu đã yêu cầu ghép cặp
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
                                            // Nếu chưa yêu cầu ghép cặp
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
                    );
                })}
            </div>
        </div>
      </main>
    </div>
  );
}
