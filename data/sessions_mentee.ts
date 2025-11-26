// data/sessions.ts

export type SessionStatus = "sap_toi" | "hoan_thanh" | "da_huy" | "cho_xac_nhan";

// Thông tin 1 phiên mà sinh viên đã đăng ký
export interface Session {
  code: string;          // Mã phiên / mã buổi học
  title: string;         // Chủ đề
  time: string;          // Thời gian hiển thị
  method: string;        // Hình thức (Trực tiếp / Trực tuyến)
  location: string;      // Địa điểm
  status: SessionStatus; // Trạng thái
  username: string;      // Username của tài khoản đăng nhập (primary key logic bên FE)
}

// Giả lập "database" các phiên đã đăng ký
// 👉 Sau này bạn chỉ cần thay mảng này bằng data lấy từ backend/API
export const mockSessions: Session[] = [
  // ====== SV1 – các phiên sắp tới ======
  {
    code: "CS101",
    title: "Giới thiệu về Lập trình",
    time: "2024-06-11 10:00 - 11:30",
    method: "Trực tuyến",
    location: "Google Meet",
    status: "sap_toi",
    username: "sv1",
  },
  {
    code: "S9001",
    title: "Phát triển kỹ năng mềm",
    time: "2024-05-10 10:00 - 11:00",
    method: "Trực tuyến",
    location: "Zoom",
    status: "sap_toi",
    username: "sv1",
  },
  {
    code: "RS0006",
    title: "Học JavaScript từ cơ bản đến nâng cao",
    time: "2024-05-13 10:00 - 12:00",
    method: "Trực tuyến",
    location: "Zoom Meeting ID: 987 654 3210",
    status: "sap_toi",
    username: "sv1",
  },
  {
    code: "RS0007",
    title: "Kỹ năng phỏng vấn xin việc",
    time: "2024-05-16 09:30 - 10:30",
    method: "Trực tiếp",
    location: "Phòng phỏng vấn B - Tòa nhà Khởi Nghiệp",
    status: "sap_toi",
    username: "sv1",
  },
  {
    code: "RS0009",
    title: "Kỹ năng phỏng vấn xin việc",
    time: "2024-05-18 09:30 - 10:30",
    method: "Trực tiếp",
    location: "Phòng phỏng vấn B - Tòa nhà Khởi Nghiệp",
    status: "sap_toi",
    username: "sv1",
  },
  {
    code: "RS0010",
    title: "Kỹ năng phỏng vấn xin việc",
    time: "2024-05-20 09:30 - 10:30",
    method: "Trực tiếp",
    location: "Phòng phỏng vấn B - Tòa nhà Khởi Nghiệp",
    status: "sap_toi",
    username: "sv1",
  },

  // ====== SV1 – các phiên đã hoàn thành ======
  {
    code: "RS1001",
    title: "Luyện thi IELTS chuyên sâu",
    time: "2024-04-01 14:00 - 15:30",
    method: "Trực tiếp",
    location: "Phòng học A201 - Cơ sở chính",
    status: "hoan_thanh",
    username: "sv1",
  },
  {
    code: "RS1002",
    title: "Kỹ năng thuyết trình chuyên nghiệp",
    time: "2024-03-25 16:00 - 17:30",
    method: "Trực tiếp",
    location: "Hội trường lớn - Tòa nhà H",
    status: "hoan_thanh",
    username: "sv1",
  },
  {
    code: "RS1003",
    title: "Kỹ năng làm việc nhóm hiệu quả",
    time: "2024-03-15 08:00 - 09:30",
    method: "Trực tuyến",
    location: "Google Meet",
    status: "hoan_thanh",
    username: "sv1",
  },

  // ====== SV2 – demo user khác (có cả sắp tới và đã hoàn thành) ======
  {
    code: "RS2001",
    title: "Định hướng nghề nghiệp cho sinh viên năm 1",
    time: "2024-05-05 09:00 - 10:30",
    method: "Trực tuyến",
    location: "Zoom",
    status: "sap_toi",
    username: "sv2",
  },
  {
    code: "RS2002",
    title: "Quản lý thời gian hiệu quả",
    time: "2024-04-10 13:30 - 15:00",
    method: "Trực tiếp",
    location: "Phòng B305 - Cơ sở 2",
    status: "hoan_thanh",
    username: "sv2",
  },
];

export async function cancelSessionMock(
  code: string,
  username?: string,
  reason?: string
): Promise<Session | null> {
  // delay 300ms cho giống gọi API thật
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = mockSessions.findIndex(
    (s) => s.code === code && (!username || s.username === username)
  );

  if (index === -1) return null;

  // Cập nhật trạng thái sang "da_huy"
  mockSessions[index] = {
    ...mockSessions[index],
    status: "da_huy",
  };

  console.log("[FAKE API] cancelSessionMock", {
    code,
    username,
    reason,
    updated: mockSessions[index],
  });

  return mockSessions[index];
}
