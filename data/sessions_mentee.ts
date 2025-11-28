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
    time: "2024-07-20 10:00 - 12:00",
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

import { SESSIONS } from "./mockData";

// ---- Helper check xung đột thời gian ----
type SimpleRange = {
  date: string;  // "2024-05-10"
  start: string; // "10:00"
  end: string;   // "11:00"
};

function parseSimpleRange(timeStr: string): SimpleRange | null {
  if (!timeStr) return null;
  const parts = timeStr.split(" ");
  if (parts.length < 4) return null;
  const [date, start, , end] = parts;
  if (!date || !start || !end) return null;
  return { date, start, end };
}

function isTimeConflict(a: SimpleRange, b: SimpleRange): boolean {
  if (a.date !== b.date) return false;
  const noOverlap = a.end <= b.start || b.end <= a.start;
  return !noOverlap;
}

export interface BookSessionResult {
  ok: boolean;
  error?: string;
  booking?: Session;
}

/**
 * API giả lập đặt chỗ:
 *  - Kiểm tra tồn tại phiên (trong mockData.SESSIONS)
 *  - Kiểm tra sức chứa
 *  - Kiểm tra xung đột lịch với các phiên sắp tới của sinh viên
 *  - Nếu OK -> tạo booking mới trong mockSessions, cập nhật sức chứa trong SESSIONS
 */
export async function bookSessionMock(
  sessionCode: string,
  username: string
): Promise<BookSessionResult> {
  // delay nhẹ cho giống gọi API
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!username) {
    return { ok: false, error: "Không xác định được tài khoản sinh viên." };
  }

  // 1. Tìm phiên trong mockData.SESSIONS
  const rawSessions = SESSIONS as any[];
  const indexSession = rawSessions.findIndex(
    (s) => (s.code || s.id || s.sessionId) === sessionCode
  );

  if (indexSession === -1) {
    return { ok: false, error: "Không tìm thấy phiên cần đặt chỗ." };
  }

  const tpl = rawSessions[indexSession];

  // 2. Tính sức chứa còn lại
  let max: number | null =
    typeof tpl.max === "number" ? tpl.max : null;
  let current: number | null =
    typeof tpl.current === "number" ? tpl.current : null;

  let remaining: number | null = null;
  if (typeof tpl.remaining === "number") {
    remaining = tpl.remaining;
  } else if (typeof tpl.slotsRemaining === "number") {
    remaining = tpl.slotsRemaining;
  } else if (max !== null && current !== null) {
    remaining = max - current;
  }

  if (remaining !== null && remaining <= 0) {
    return { ok: false, error: "Phiên này đã hết chỗ, không thể đăng ký." };
  }

  // 3. Kiểm tra xung đột lịch với các phiên SẮP TỚI / CHỜ XÁC NHẬN của sinh viên
  const newRange = parseSimpleRange(tpl.time || "");
  if (newRange) {
    const myUpcoming = mockSessions.filter(
      (s) =>
        s.username === username &&
        (s.status === "sap_toi" || s.status === "cho_xac_nhan")
    );

    const conflict = myUpcoming.some((b) => {
      const r = parseSimpleRange(b.time);
      return r && isTimeConflict(newRange, r);
    });

    if (conflict) {
      return {
        ok: false,
        error:
          "Phiên này bị trùng thời gian với một phiên bạn đã đăng ký trước đó.",
      };
    }
  }

  // 4. Tạo booking mới trong mockSessions
  const newBooking: Session = {
    code: tpl.code || tpl.id || sessionCode,
    title: tpl.title || "",
    time: tpl.time || "",
    method: tpl.method || tpl.format || "Trực tiếp",
    location: tpl.location || "",
    status: "sap_toi",
    username,
  };

  mockSessions.push(newBooking);

  // 5. Cập nhật sức chứa trong SESSIONS
  // if (remaining !== null) {
  //   if (typeof tpl.remaining === "number") {
  //     rawSessions[indexSession] = {
  //       ...tpl,
  //       remaining: remaining - 1,
  //     };
  //   } else if (typeof tpl.slotsRemaining === "number") {
  //     rawSessions[indexSession] = {
  //       ...tpl,
  //       slotsRemaining: remaining - 1,
  //     };
  //   } else if (max !== null && current !== null) {
  //     rawSessions[indexSession] = {
  //       ...tpl,
  //       current: current + 1,
  //     };
  //   }
  // }

  console.log("[FAKE API] bookSessionMock", {
    username,
    sessionCode,
    booking: newBooking,
    updatedSession: rawSessions[indexSession],
  });

  return { ok: true, booking: newBooking };
}