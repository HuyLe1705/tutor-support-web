"use client";

import Header from '@/components/Header';
import { Search, Filter, MapPin, Star, Users, Heart, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react'; // Thêm useMemo

// --- DỮ LIỆU MOCK MỞ RỘNG ---
const MOCK_TUTORS = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        subject: "Lập trình Web, React",
        subjectType: "Technical",
        rating: 4.8,
        sessions_count: 45,
        location: "Online",
        time: "Buổi tối, cuối tuần",
        bio: "Có 5 năm kinh nghiệm giảng dạy và làm việc với React/Node.js, cam kết chất lượng",
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff",
    },
    {
        id: 2,
        name: "Trần Thị B",
        subject: "Machine Learning, Python",
        subjectType: "Technical",
        rating: 4.9,
        sessions_count: 62,
        location: "CS1, Tầng 3",
        time: "Buổi sáng, Buổi tối",
        bio: "Chuyên gia ML với nhiều dự án thực tế, kinh nghiệm làm việc tại công ty lớn.",
        avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random&color=fff",
    },
    {
        id: 3,
        name: "Lê Văn C",
        subject: "Toán Cao Cấp, Giải tích 1",
        subjectType: "General",
        rating: 4.5,
        sessions_count: 30,
        location: "CS2, Khu B",
        time: "Buổi chiều",
        bio: "Thạc sĩ Toán học, phương pháp giảng dạy dễ hiểu.",
        avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=10B981&color=fff",
    },
    {
        id: 4,
        name: "Phạm Thị D",
        subject: "Tiếng Anh Giao Tiếp, IELTS",
        subjectType: "Language",
        rating: 5.0,
        sessions_count: 88,
        location: "Online",
        time: "Buổi sáng, cuối tuần",
        bio: "8.0 IELTS, giáo trình độc quyền, giúp học viên tự tin giao tiếp.",
        avatar: "https://ui-avatars.com/api/?name=Pham+Thi+D&background=EF4444&color=fff",
    },
    {
        id: 5,
        name: "Hoàng Minh E",
        subject: "Cơ sở dữ liệu, SQL",
        subjectType: "Technical",
        rating: 4.3,
        sessions_count: 22,
        location: "CS1, Tầng 5",
        time: "Buổi tối",
        bio: "Đang là Database Administrator tại FPT Software.",
        avatar: "https://ui-avatars.com/api/?name=Hoang+Minh+E&background=3B82F6&color=fff",
    }
];

// Định nghĩa các lựa chọn cho bộ lọc
const FILTER_OPTIONS = {
    time: ["Tất cả", "Buổi sáng", "Buổi chiều", "Buổi tối", "Cuối tuần"],
    location: ["Tất cả", "Online", "CS1, Tầng 3", "CS2, Khu B", "CS1, Tầng 5"],
    subjectType: ["Tất cả", "Technical", "General", "Language"],
    rating: ["Tất cả", "Từ 4.5 sao trở lên", "Từ 4.0 sao trở lên", "Từ 3.0 sao trở lên"],
};


export default function StudentSearchPage() {
    // --- STATE CŨ ---
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilter, setShowFilter] = useState(true);
    const [likedTutors, setLikedTutors] = useState([]);
    const [likesLoaded, setLikesLoaded] = useState(false);
    const [requestedTutorIds, setRequestedTutorIds] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // --- STATE MỚI: BỘ LỌC ---
    const [filterTime, setFilterTime] = useState("Tất cả");
    const [filterSubjectType, setFilterSubjectType] = useState("Tất cả");
    const [filterLocation, setFilterLocation] = useState("Tất cả");
    const [filterRating, setFilterRating] = useState("Tất cả");

    const toggleLikeTutor = (id) => {
        setLikedTutors(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            }
            return [...prev, id];
        });
    };

    // --- EFFECT: LOAD & SAVE LIKES ---
    useEffect(() => {
        const savedLikes = localStorage.getItem("liked_tutors");
        if (savedLikes) setLikedTutors(JSON.parse(savedLikes));
        setLikesLoaded(true);
    }, []);

    useEffect(() => {
        if (!likesLoaded) return;
        localStorage.setItem("liked_tutors", JSON.stringify(likedTutors));
    }, [likedTutors, likesLoaded]);

    // --- EFFECT: LOAD & SAVE REQUESTS ---
    useEffect(() => {
        const savedReq = localStorage.getItem('pairing_requests');
        if (savedReq) setRequestedTutorIds(JSON.parse(savedReq));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('pairing_requests', JSON.stringify(requestedTutorIds));
        }
    }, [requestedTutorIds, isLoaded]);

    // --- HANDLER: YÊU CẦU GHÉP CẶP ---
    const handlePairingRequest = (tutorId, tutorName) => {
        setRequestedTutorIds(prev => [...prev, tutorId]);
        alert(`Đã gửi yêu cầu ghép cặp tới: ${tutorName}`);
    }

    const handleCancelPairing = (tutorId) => {
        if (confirm("Bạn muốn hủy yêu cầu ghép cặp này?")) {
            setRequestedTutorIds(prev => prev.filter(id => id !== tutorId));
        }
    }
    
    // --- HANDLER: XOÁ BỘ LỌC ---
    const handleClearFilters = () => {
        setSearchTerm("");
        setFilterTime("Tất cả");
        setFilterSubjectType("Tất cả");
        setFilterLocation("Tất cả");
        setFilterRating("Tất cả");
    }

    // --- LOGIC SEARCH & FILTER (DÙNG useMemo ĐỂ TỐI ƯU HÓA) ---
    const filteredTutors = useMemo(() => {
        let results = MOCK_TUTORS;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // 1. Lọc theo thanh tìm kiếm
        if (searchTerm) {
            results = results.filter(t => 
                t.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                t.subject.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        // 2. Lọc theo Bộ lọc Thời gian
        if (filterTime !== "Tất cả") {
            // Logic lọc phức tạp hơn: kiểm tra xem chuỗi 'time' của tutor CÓ CHỨA chuỗi 'filterTime' không
            // Ví dụ: Tutor 'Buổi sáng, cuối tuần' sẽ hiện ra khi lọc 'Buổi sáng' hoặc 'Cuối tuần'
            results = results.filter(t => 
                t.time.toLowerCase().includes(filterTime.toLowerCase())
            );
        }

        // 3. Lọc theo Bộ lọc Loại môn học
        if (filterSubjectType !== "Tất cả") {
            results = results.filter(t => t.subjectType === filterSubjectType);
        }

        // 4. Lọc theo Bộ lọc Địa điểm
        if (filterLocation !== "Tất cả") {
            results = results.filter(t => t.location === filterLocation);
        }
        
        // 5. Lọc theo Bộ lọc Đánh giá (Rating)
        if (filterRating !== "Tất cả") {
            const minRating = parseFloat(filterRating.match(/\d+\.?\d*/)?.[0] || 0);
            results = results.filter(t => t.rating >= minRating);
        }

        return results;

    }, [searchTerm, filterTime, filterSubjectType, filterLocation, filterRating]);

    if (!isLoaded) return null; // Hiển thị loading hoặc spinner nếu cần

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-sm text-gray-700">
            <Header title="Tìm kiếm Tutor" />
            
            <main className="pt-[80px] p-4 md:ml-64 transition-all duration-300 max-w-6xl mx-auto">
                
                {/* --- SECTION 1: SEARCH & FILTER --- */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                    <h2 className="font-semibold text-gray-800 mb-3 border-b pb-2">🔍 Tìm kiếm Tutor</h2>
                    
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Lọc Thời gian */}
                                <div className="relative">
                                    <select 
                                        value={filterTime}
                                        onChange={(e) => setFilterTime(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none cursor-pointer"
                                    >
                                        <option value="Tất cả">Thời gian (Tất cả)</option>
                                        {FILTER_OPTIONS.time.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/>
                                </div>
                                
                                {/* Lọc Loại môn học */}
                                <div className="relative">
                                    <select 
                                        value={filterSubjectType}
                                        onChange={(e) => setFilterSubjectType(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none cursor-pointer"
                                    >
                                        <option value="Tất cả">Loại môn học (Tất cả)</option>
                                        {FILTER_OPTIONS.subjectType.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/>
                                </div>

                                {/* Lọc Địa điểm */}
                                <div className="relative">
                                    <select 
                                        value={filterLocation}
                                        onChange={(e) => setFilterLocation(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none cursor-pointer"
                                    >
                                        <option value="Tất cả">Địa điểm (Tất cả)</option>
                                        {FILTER_OPTIONS.location.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/>
                                </div>
                                
                                {/* Lọc Đánh giá */}
                                <div className="relative">
                                    <select 
                                        value={filterRating}
                                        onChange={(e) => setFilterRating(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none cursor-pointer"
                                    >
                                        {FILTER_OPTIONS.rating.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"/>
                                </div>

                            </div>
                            <div className="text-center mt-4">
                                <button onClick={handleClearFilters} className="text-blue-500 text-sm hover:underline">
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- SECTION 2: DANH SÁCH TUTOR --- */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách Tutor nổi bật</h2>
                    <div className="space-y-4">
                        {filteredTutors.length === 0 ? (
                            <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
                                <p className="text-gray-500 italic">😔 Không tìm thấy Tutor phù hợp. Vui lòng thử từ khóa khác hoặc điều chỉnh bộ lọc.</p>
                            </div>
                        ) : ( 
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
                                                    <p className="text-gray-500 mb-2">{tutor.subject} <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">{tutor.subjectType}</span></p>
                                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                                                        <span className="flex items-center gap-1 text-yellow-500 font-medium"><Star className="w-3 h-3 fill-current" /> {tutor.rating}</span>
                                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {tutor.sessions_count} phiên</span>
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {tutor.location}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm italic line-clamp-2">{tutor.bio}</p>
                                                </div>
                                                
                                                <div className="flex flex-col items-end gap-2 ml-4">
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
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}