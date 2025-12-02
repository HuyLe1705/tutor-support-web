"use client";

import Header from '@/components/Header';
import { Search, Filter, MapPin, Star, Users, Heart, ChevronDown, CheckCircle, XCircle, Clock, MessageSquare, BookOpen, RefreshCw } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

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
        bio: "Có 5 năm kinh nghiệm giảng dạy và làm việc với React/Node.js, cam kết chất lượng. Phương pháp: tập trung thực hành.",
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
        bio: "Thạc sĩ Toán học, phương pháp giảng dạy dễ hiểu. Đã hỗ trợ 30 sinh viên qua môn.",
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
        bio: "Đang là Database Administrator tại FPT Software. Chuyên sâu về tối ưu truy vấn.",
        avatar: "https://ui-avatars.com/api/?name=Hoang+Minh+E&background=3B82F6&color=fff",
    }
];

// Giả định sinh viên đã được ghép cặp với Tutor 101.
const CURRENT_TUTOR_MOCK = {
    id: 101,
    name: "Lý Thành Công (Tutor Hiện tại)",
    subject: "Lập trình Web, React",
    subjectType: "Technical",
    rating: 4.7,
    sessions_count: 99,
    location: "Online/Offline",
    time: "Linh hoạt",
    bio: "Tutor hiện tại của bạn.",
    avatar: "https://ui-avatars.com/api/?name=Ly+Thanh+Cong&background=9CA3AF&color=fff",
};

const FILTER_OPTIONS = {
    time: ["Tất cả", "Buổi sáng", "Buổi chiều", "Buổi tối", "Cuối tuần"],
    location: ["Tất cả", "Online", "CS1, Tầng 3", "CS2, Khu B", "CS1, Tầng 5"],
    subjectType: ["Tất cả", "Technical", "General", "Language"],
    rating: ["Tất cả", "Từ 4.5 sao trở lên", "Từ 4.0 sao trở lên", "Từ 3.0 sao trở lên"],
};

// --- MODAL XEM CHI TIẾT TUTOR ---
// Giữ nguyên DetailModal (chỉ thay đổi cách gọi handlePairingAction)

const DetailModal = ({ tutor, onClose, handlePairingAction, isRequested, isCurrentTutor, isSwapRequested, getCurrentTutor }) => {
    if (!tutor) return null;

    const ActionButton = () => {
        if (isCurrentTutor) {
            return (
                <span className="text-gray-500 text-sm font-medium">Đã là Tutor hiện tại của bạn.</span>
            );
        } else if (getCurrentTutor()) { // Đã có Tutor hiện tại -> chỉ có nút ĐỔI TƯỢNG
            if (isSwapRequested) {
                 return (
                    <button 
                        disabled
                        className="bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-md font-medium transition-colors shadow-md flex items-center gap-2 cursor-default"
                    >
                        <RefreshCw className="w-4 h-4 animate-spin-slow" /> Đã gửi yêu cầu đổi
                    </button>
                 );
            }
            return (
                <button 
                    onClick={() => handlePairingAction('swap', tutor.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-md flex items-center gap-2"
                >
                    <Users className="w-4 h-4" /> Yêu cầu Đổi Tutor
                </button>
            )
        } else if (isRequested) { // Chưa có Tutor hiện tại -> chỉ có nút YÊU CẦU/HỦY
            return (
                <div className="flex items-center gap-2">
                    <button 
                        disabled
                        className="bg-gray-100 text-gray-500 border border-gray-200 px-4 py-2 rounded-md font-medium flex items-center gap-1 cursor-default"
                    >
                        <CheckCircle className="w-4 h-4" /> Đã yêu cầu
                    </button>
                    <button 
                        onClick={() => handlePairingAction('cancel', tutor.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md font-medium flex items-center gap-1 transition-colors"
                    >
                        <XCircle className="w-4 h-4" /> Hủy yêu cầu
                    </button>
                </div>
            );
        } else {
            return (
                <button 
                    onClick={() => handlePairingAction('request', tutor.id, tutor.name)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-md flex items-center gap-2"
                >
                    <Users className="w-4 h-4" /> Gửi yêu cầu ghép cặp
                </button>
            );
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in">
                <div className="p-6">
                    <div className="flex items-start gap-4 border-b pb-4 mb-4">
                        <img src={tutor.avatar} alt={tutor.name} className="w-20 h-20 rounded-full object-cover bg-gray-200 shadow-md" />
                        <div>
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{tutor.name}</h3>
                            <p className="text-blue-600 font-semibold mb-2">{tutor.subject}</p>
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{tutor.subjectType}</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6 text-gray-700">
                        <p className="flex items-center gap-2 text-yellow-600">
                            <Star className="w-5 h-5 fill-current" /> 
                            Đánh giá: <span className="font-bold text-lg">{tutor.rating}</span> / 5.0 ({tutor.sessions_count} phiên)
                        </p>
                        <p className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-500" /> 
                            Địa điểm: <span className="font-medium">{tutor.location}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" /> 
                            Thời gian rảnh: <span className="font-medium">{tutor.time}</span>
                        </p>
                        <div className="pt-2 border-t mt-3">
                            <p className="font-semibold text-gray-800 flex items-center gap-2 mb-1"><BookOpen className="w-5 h-5 text-gray-500" /> Giới thiệu:</p>
                            <blockquote className="italic text-gray-600 pl-4 border-l-4 border-gray-200">"{tutor.bio}"</blockquote>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <button 
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md"
                    >
                        Đóng
                    </button>
                    <ActionButton />
                </div>
            </div>
        </div>
    );
};

// --- MODAL YÊU CẦU ĐỔI TUTOR ---
const SwapModal = ({ currentTutor, newTutor, onSwapSubmit, onClose, swapReason, setSwapReason }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (swapReason.trim() === "") {
            alert("Vui lòng nhập lý do đổi Tutor.");
            return;
        }
        onSwapSubmit(swapReason);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-zoom-in">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-red-600 border-b pb-3 mb-4">⚠️ Xác nhận Yêu cầu Đổi Tutor</h3>
                        <p className="text-gray-700 mb-4">Bạn đang ghép cặp với **{currentTutor.name}**.</p>
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mb-4 text-sm">
                            Bạn đang yêu cầu chuyển sang Tutor: **{newTutor.name}**.
                        </div>
                        
                        <label htmlFor="swapReason" className="block text-sm font-medium text-gray-700 mb-2">
                            Lý do bạn muốn đổi Tutor: <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="swapReason"
                            value={swapReason}
                            onChange={(e) => setSwapReason(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ví dụ: Lịch học không phù hợp, phương pháp giảng dạy chưa hiệu quả, v.v."
                            required
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-2">Yêu cầu sẽ được Hệ thống kiểm tra và phản hồi qua email.</p>
                    </div>

                    <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
                        >
                            Gửi yêu cầu đổi Tutor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- COMPONENT CHÍNH ---
export default function StudentSearchPage() {
    // --- MOCK TÌNH TRẠNG GHÉP CẶP ---
    // Đổi giá trị này thành null để test trường hợp CHƯA CÓ TUTOR GHÉP CẶP
    const [currentTutorId, setCurrentTutorId] = useState(CURRENT_TUTOR_MOCK.id); 
    
    // --- STATE CŨ/CHUNG ---
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilter, setShowFilter] = useState(true);
    const [likedTutors, setLikedTutors] = useState([]);
    const [requestedTutorIds, setRequestedTutorIds] = useState([]); // Yêu cầu ghép cặp (khi chưa có currentTutor)
    const [isLoaded, setIsLoaded] = useState(false);
    
    // --- STATE BỘ LỌC ---
    const [filterTime, setFilterTime] = useState("Tất cả");
    const [filterSubjectType, setFilterSubjectType] = useState("Tất cả");
    const [filterLocation, setFilterLocation] = useState("Tất cả");
    const [filterRating, setFilterRating] = useState("Tất cả");

    // --- STATE LOGIC GHÉP CẶP/ĐỔI MỚI ---
    const [showSwapForm, setShowSwapForm] = useState(false);
    const [swapReason, setSwapReason] = useState("");
    const [newTutorToSwap, setNewTutorToSwap] = useState(null); 
    const [selectedTutor, setSelectedTutor] = useState(null); 
    const [showDetailModal, setShowDetailModal] = useState(false);
    
    // MỚI: State lưu ID Tutor đã gửi yêu cầu đổi sang
    const [swappedRequestedTutorId, setSwappedRequestedTutorId] = useState(null); 

    // --- UTILITY FUNCTIONS ---
    const getCurrentTutor = () => (currentTutorId ? CURRENT_TUTOR_MOCK : null);
    const getAllTutors = () => (currentTutorId ? [getCurrentTutor(), ...MOCK_TUTORS.filter(t => t.id !== currentTutorId)] : MOCK_TUTORS);

    const toggleLikeTutor = (id) => {
        setLikedTutors(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            }
            return [...prev, id];
        });
    };

    // --- EFFECTS: LOAD DATA ---
    useEffect(() => {
        const savedLikes = localStorage.getItem("liked_tutors");
        if (savedLikes) setLikedTutors(JSON.parse(savedLikes));
        const savedReq = localStorage.getItem('pairing_requests');
        if (savedReq) setRequestedTutorIds(JSON.parse(savedReq));
        const savedSwapReq = localStorage.getItem('swap_request_id'); // Load trạng thái yêu cầu đổi
        if (savedSwapReq) setSwappedRequestedTutorId(JSON.parse(savedSwapReq));

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("liked_tutors", JSON.stringify(likedTutors));
        localStorage.setItem('pairing_requests', JSON.stringify(requestedTutorIds));
        localStorage.setItem('swap_request_id', JSON.stringify(swappedRequestedTutorId)); // Lưu trạng thái yêu cầu đổi
    }, [likedTutors, requestedTutorIds, swappedRequestedTutorId, isLoaded]);

    // --- HANDLER: CHỨC NĂNG GHÉP CẶP/ĐỔI/HỦY (HÀM GỘP) ---
    const handlePairingAction = (action, tutorId, tutorName) => {
        const tutor = getAllTutors().find(t => t.id === tutorId);
        if (!tutor) return;

        setShowDetailModal(false); 

        switch (action) {
            case 'request': // Gửi yêu cầu ghép cặp (Khi chưa có Tutor)
                if (currentTutorId) return alert("Bạn đã có Tutor ghép cặp, vui lòng sử dụng chức năng Đổi Tutor.");
                setRequestedTutorIds(prev => [...prev, tutorId]);
                alert(`Đã gửi yêu cầu ghép cặp tới: ${tutorName}.`);
                break;
            
            case 'cancel': // Hủy yêu cầu ghép cặp (Khi chưa có Tutor)
                if (confirm(`Bạn muốn hủy yêu cầu ghép cặp tới ${tutor.name}?`)) {
                    setRequestedTutorIds(prev => prev.filter(id => id !== tutorId));
                }
                break;

            case 'swap': // Bắt đầu quá trình Đổi Tutor (Chỉ khi đã có Tutor)
                if (!currentTutorId) return alert("Bạn chưa có Tutor ghép cặp.");
                if (swappedRequestedTutorId) return alert(`Bạn đã có yêu cầu đổi Tutor đang chờ xử lý với ${getAllTutors().find(t => t.id === swappedRequestedTutorId)?.name}.`);
                setNewTutorToSwap(tutor);
                setShowSwapForm(true);
                break;
            
            default:
                break;
        }
    }

    // --- HANDLER: GỬI FORM ĐỔI TUTOR ---
    const handleSwapRequest = (reason) => {
        // Mô phỏng quá trình gửi yêu cầu đổi Tutor
        console.log(`Gửi yêu cầu đổi Tutor: Cũ ID ${currentTutorId} sang Mới ID ${newTutorToSwap.id}, Lý do: ${reason}`);
        
        // Cập nhật trạng thái: Đã gửi yêu cầu đổi sang Tutor này
        setSwappedRequestedTutorId(newTutorToSwap.id);

        alert(`✅ Đã gửi yêu cầu đổi Tutor từ ${getCurrentTutor().name} sang ${newTutorToSwap.name} với lý do: "${reason}". Hệ thống sẽ xử lý và phản hồi cho bạn!`);
        
        // Reset form
        setShowSwapForm(false);
        setSwapReason(""); 
        setNewTutorToSwap(null);
    }
    // --- HANDLER: XÓA BỘ LỌC ---
    const handleClearFilters = () => {
        setSearchTerm(""); // Xóa từ khóa tìm kiếm
        setFilterTime("Tất cả");
        setFilterSubjectType("Tất cả");
        setFilterLocation("Tất cả");
        setFilterRating("Tất cả");
    };

    // --- LOGIC SEARCH & FILTER (DÙNG useMemo ĐỂ TỐI ƯU HÓA) ---
    const filteredTutors = useMemo(() => {
        let results = MOCK_TUTORS;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // 1. Loại bỏ Tutor hiện tại khỏi danh sách tìm kiếm MOCK nếu có
        if (currentTutorId) {
            results = results.filter(t => t.id !== currentTutorId);
        }

        // 2. Lọc theo thanh tìm kiếm
        if (searchTerm) {
            results = results.filter(t => 
                t.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                t.subject.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        // 3. Lọc theo Bộ lọc khác
        if (filterTime !== "Tất cả") {
            results = results.filter(t => 
                t.time.toLowerCase().includes(filterTime.toLowerCase())
            );
        }
        if (filterSubjectType !== "Tất cả") {
            results = results.filter(t => t.subjectType === filterSubjectType);
        }
        if (filterLocation !== "Tất cả") {
            results = results.filter(t => t.location === filterLocation);
        }
        if (filterRating !== "Tất cả") {
            const minRating = parseFloat(filterRating.match(/\d+\.?\d*/)?.[0] || 0);
            results = results.filter(t => t.rating >= minRating);
        }

        return results;

    }, [searchTerm, filterTime, filterSubjectType, filterLocation, filterRating, currentTutorId]);

    // Thêm Tutor hiện tại vào đầu danh sách nếu có
    const displayTutors = currentTutorId 
        ? [getCurrentTutor(), ...filteredTutors] 
        : filteredTutors;


    if (!isLoaded) return <div className="p-8 text-center text-gray-500">Đang tải...</div>; 

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-sm text-gray-700">
            <Header title="Tìm kiếm & Ghép cặp Tutor" />
            
            <main className="pt-[80px] p-4 md:ml-64 transition-all duration-300 max-w-6xl mx-auto">
                
                {/* --- HIỂN THỊ TRẠNG THÁI CHUNG --- */}
                {currentTutorId ? (
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-6 rounded-lg shadow-sm">
                        <p className="text-green-800 font-medium flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500"/> 
                            Bạn đã ghép cặp với Tutor **{getCurrentTutor().name}**. Vui lòng chọn Tutor mới và nhấn **"Yêu cầu Đổi Tutor"**.
                        </p>
                         {swappedRequestedTutorId && (
                            <div className="bg-red-100 border border-red-300 p-2 mt-2 rounded-md flex items-center gap-2 text-red-800 text-xs">
                                <RefreshCw className="w-4 h-4 animate-spin-slow"/>
                                Yêu cầu đổi Tutor sang **{displayTutors.find(t => t.id === swappedRequestedTutorId)?.name}** đang **chờ Hệ thống phê duyệt**. Bạn không thể gửi thêm yêu cầu đổi khác.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-6 rounded-lg shadow-sm">
                        <p className="text-blue-800 font-medium flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500"/> 
                            Bạn chưa có Tutor. Vui lòng chọn và nhấn **"Gửi yêu cầu ghép cặp"**.
                        </p>
                    </div>
                )}

                {/* --- SECTION 1: SEARCH & FILTER (Giữ nguyên) --- */}
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
                                {/* Dropdowns... */}
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
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {currentTutorId ? "Tutor Hiện tại & Đề xuất Đổi" : "Danh sách Tutor"}
                    </h2>
                    <div className="space-y-4">
                        {displayTutors.length === 0 ? (
                            <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
                                <p className="text-gray-500 italic">😔 Không tìm thấy Tutor phù hợp. Vui lòng thử từ khóa khác hoặc điều chỉnh bộ lọc.</p>
                            </div>
                        ) : ( 
                            displayTutors.map((tutor) => {
                                const isRequested = requestedTutorIds.includes(tutor.id);
                                const isCurrentTutor = tutor.id === currentTutorId;
                                const hasCurrentTutor = !!currentTutorId;
                                // MỚI: Kiểm tra xem Tutor này có phải là Tutor đang chờ đổi sang không
                                const isSwapRequested = tutor.id === swappedRequestedTutorId;

                                return (
                                    <div 
                                        key={tutor.id} 
                                        className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start hover:shadow-lg transition-shadow cursor-pointer ${isCurrentTutor ? 'bg-yellow-100 border-yellow-300' : ''} ${isSwapRequested ? 'bg-red-50 border-red-300' : ''}`}
                                        onClick={() => {
                                            setSelectedTutor(tutor);
                                            setShowDetailModal(true);
                                        }}
                                    >
                                        <div className="flex-shrink-0">
                                            <img src={tutor.avatar} alt={tutor.name} className={`w-16 h-16 rounded-md object-cover ${isCurrentTutor ? 'border-2 border-yellow-500' : isSwapRequested ? 'border-2 border-red-500' : 'bg-gray-200'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{tutor.name} 
                                                        {isCurrentTutor && <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full ml-1 font-normal">Hiện tại</span>}
                                                    </h3>
                                                    <p className="text-gray-500 mb-2">{tutor.subject} <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">{tutor.subjectType}</span></p>
                                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                                                        <span className="flex items-center gap-1 text-yellow-500 font-medium"><Star className="w-3 h-3 fill-current" /> {tutor.rating}</span>
                                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {tutor.sessions_count} phiên</span>
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {tutor.location}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm italic line-clamp-2">{tutor.bio}</p>
                                                </div>
                                                
                                                <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                                                    
                                                    {/* --- LOGIC NÚT HÀNH ĐỘNG --- */}
                                                    {isCurrentTutor ? (
                                                        null // Tutor hiện tại không có nút hành động
                                                    ) : hasCurrentTutor ? (
                                                        // NẾU ĐÃ CÓ TUTOR, CHỈ CÓ NÚT ĐỔI TƯỢNG
                                                        isSwapRequested ? (
                                                            // ĐÃ gửi yêu cầu đổi sang Tutor này
                                                            <button 
                                                                disabled
                                                                className="bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-md font-medium text-xs flex items-center gap-1 cursor-default"
                                                            >
                                                                <RefreshCw className="w-3 h-3 animate-spin-slow" /> Đã gửi yêu cầu đổi
                                                            </button>
                                                        ) : (
                                                            // CHƯA gửi yêu cầu đổi (hoặc đã gửi sang người khác và đang chờ)
                                                            <button 
                                                                onClick={(e) => {e.stopPropagation(); handlePairingAction('swap', tutor.id)}}
                                                                disabled={!!swappedRequestedTutorId} // Vô hiệu hóa nếu đã có yêu cầu đổi khác đang chờ
                                                                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm ${
                                                                    swappedRequestedTutorId 
                                                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                                        : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                                                                }`}
                                                            >
                                                                Yêu cầu Đổi Tutor
                                                            </button>
                                                        )
                                                    ) : isRequested ? (
                                                        // NẾU CHƯA CÓ TUTOR & ĐÃ YÊU CẦU GHÉP CẶP
                                                        <div className="flex items-center gap-2 animate-fade-in">
                                                            <button 
                                                                disabled
                                                                className="bg-gray-100 text-gray-500 border border-gray-200 px-3 py-2 rounded-md font-medium text-xs flex items-center gap-1 cursor-default"
                                                            >
                                                                <CheckCircle className="w-3 h-3" /> Đã yêu cầu
                                                            </button>
                                                            <button 
                                                                onClick={(e) => {e.stopPropagation(); handlePairingAction('cancel', tutor.id)}}
                                                                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md font-medium text-xs flex items-center gap-1 transition-colors"
                                                            >
                                                                <XCircle className="w-3 h-3" /> Hủy
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        // NẾU CHƯA CÓ TUTOR & CHƯA YÊU CẦU GHÉP CẶP
                                                        <button 
                                                            onClick={(e) => {e.stopPropagation(); handlePairingAction('request', tutor.id, tutor.name)}}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm shadow-blue-200"
                                                        >
                                                            Gửi yêu cầu ghép cặp
                                                        </button>
                                                    )}
                                                    {/* --- END LOGIC NÚT HÀNH ĐỘNG --- */}

                                                    
                                                    <button 
                                                        onClick={(e) => {e.stopPropagation(); toggleLikeTutor(tutor.id)}}
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

            {/* MODAL XEM CHI TIẾT */}
            {showDetailModal && (
                <DetailModal 
                    tutor={selectedTutor} 
                    onClose={() => {setShowDetailModal(false); setSelectedTutor(null);}}
                    handlePairingAction={handlePairingAction}
                    isRequested={requestedTutorIds.includes(selectedTutor.id)}
                    isCurrentTutor={selectedTutor.id === currentTutorId}
                    isSwapRequested={selectedTutor.id === swappedRequestedTutorId} // Truyền trạng thái yêu cầu đổi
                    getCurrentTutor={getCurrentTutor} 
                />
            )}

            {/* MODAL ĐỔI TUTOR */}
            {showSwapForm && (
                <SwapModal
                    currentTutor={getCurrentTutor()}
                    newTutor={newTutorToSwap}
                    onSwapSubmit={handleSwapRequest}
                    onClose={() => setShowSwapForm(false)}
                    swapReason={swapReason}
                    setSwapReason={setSwapReason}
                />
            )}
        </div>
    );
}