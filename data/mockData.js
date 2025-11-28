export const USER_INFO = {
  name: "Nguyễn Văn A",
  role: "Tutor",
  department: "Khoa Khoa học và Kỹ thuật Máy tính",
  avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff"
};

// Dữ liệu Lịch rảnh (Trang Thiết lập lịch)
export const TUTOR_SCHEDULES = [
  { id: 1, day: "Thứ 2", time: "09:00 - 11:00", type: "Offline", location: "Phòng 401 A4" },
  { id: 2, day: "Thứ 3", time: "09:00 - 11:00", type: "Offline", location: "Thư viện" },
  { id: 3, day: "Thứ 5", time: "15:00 - 16:50", type: "Online", location: "Google Meet" },
];

// Dữ liệu Phiên tư vấn (Trang Quản lý phiên)
export const SESSIONS = [
  { 
    id: "S001", 
    title: "Giới thiệu về Phát triển Web", 
    time: "2024-07-20 10:00", 
    format: "Trực tuyến", 
    status: "Đã diễn ra", 
    current: 15, 
    max: 20,
    action: "view"
  },
  { 
    id: "S002", 
    title: "Kỹ năng Phỏng vấn IT", 
    time: "2024-07-25 14:00", 
    format: "Trực tiếp", 
    status: "Sắp tới", 
    current: 10, 
    max: 15,
    action: "view"
  },
  { 
    id: "S003", 
    title: "Xây dựng Portfolio Chuyên nghiệp", 
    time: "2024-08-01 09:30", 
    format: "Trực tuyến", 
    status: "Sắp tới", 
    current: 20, 
    max: 20,
    action: "view"
  }
];

// Dữ liệu Mentee (Chi tiết phiên)
export const MENTEES = [
  { id: 1, sessionId: "S001", name: "Bùi Thị N", mssv: "SV015", contact: "0866xxxxxx", status: "Đã đăng ký", attendance: "Có mặt", regDate: "2024-07-10 09:30", note: "Tập trung" },
  { id: 2, sessionId: "S001", name: "Đỗ Tuấn K", mssv: "SV012", contact: "0988xxxxxx", status: "Đã đăng ký", attendance: "Có mặt", regDate: "2024-07-09 15:00", note: "..." },
  { id: 3, sessionId: "S001", name: "Hoàng Văn M", mssv: "SV014", contact: "0919xxxxxx", status: "Đã đăng ký", attendance: "Có mặt", regDate: "2024-07-10 17:00", note: "..." },
  { id: 4, sessionId: "S001", name: "Huỳnh Gia E", mssv: "SV005", contact: "0868xxxxxx", status: "Chờ duyệt", attendance: "Vắng có lý do", regDate: "2024-07-12 10:00", note: "..." },
  { id: 5, sessionId: "S001", name: "Lê Hoàng C", mssv: "SV003", contact: "0777xxxxxx", status: "Đã đăng ký", attendance: "Có mặt", regDate: "2024-07-10 14:00", note: "Thái độ tốt" },
];

// Dữ liệu Thống kê (Trang Dashboard)
export const STATS_DATA = [
  { month: '12/2024', value: 30 },
  { month: '11/2024', value: 15 },
  { month: '01/2025', value: 100 }, // Cao điểm
  { month: '02/2025', value: 50 },
  { month: '03/2025', value: 15 },
  { month: '04/2025', value: 15 },
  { month: '05/2025', value: 55 },
  { month: '06/2025', value: 35 },
  { month: '07/2025', value: 20 },
];

export const USERS = [
  { 
    username: "sv1", 
    password: "123", 
    name: "Trần Văn Sinh Viên", 
    department: "Khoa Khoa học và Kỹ thuật Máy tính",
    role: "student", 
    avatar: "https://png.pngtree.com/png-clipart/20240321/original/pngtree-avatar-job-student-flat-portrait-of-man-png-image_14639684.png" 
  },
  { 
    username: "tutor1", 
    password: "123", 
    name: "Nguyễn Thị Tutor", 
    department: "Khoa Khoa học và Kỹ thuật Máy tính",
    role: "tutor", 
    avatar: "https://www.shutterstock.com/image-vector/cute-smiling-teacher-tutor-avatar-260nw-1716676483.jpg" 
  },
  { 
    username: "both1", 
    password: "123", 
    name: "Lê Hoàng Trợ Giảng", 
    department: "Khoa Khoa học và Kỹ thuật Máy tính",
    role: "mixed", // Vừa là SV vừa là Tutor
    avatar: "https://png.pngtree.com/png-clipart/20240321/original/pngtree-avatar-job-student-flat-portrait-of-man-png-image_14639684.png" 
  },
  { 
    username: "admin", 
    password: "123", 
    name: "Quản Trị Viên", 
    department: "Khoa Khoa học và Kỹ thuật Máy tính",
    role: "admin", 
    avatar: "https://cdn.vectorstock.com/i/1000v/54/90/administrator-avatar-icon-vector-32095490.jpg" 
  }
];

export const REPORT = [
  {
    id: "S001",
    title: "Buổi học 1: Nhập môn",
    studentCount: 32,
    time: "10/10/2025 - 14:00",
    avgScore: 8.2,
    status: "Hoàn thành",
    note: "Buổi học diễn ra suôn sẻ."
  },
  {
    id: "S002",
    title: "Buổi học 2: OOP",
    studentCount: 28,
    time: "15/10/2025 - 18:00",
    avgScore: 7.6,
    status: "Đang diễn ra",
    note: ""
  },
  {
    id: "S003",
    title: "Buổi học 3: CTDL & GT",
    studentCount: 30,
    time: "20/10/2025 - 14:00",
    avgScore: null,
    status: "Chưa bắt đầu",
    note: "Chờ sinh viên đăng ký thêm."
  }
];
