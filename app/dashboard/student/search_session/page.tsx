"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { Session } from "../../../../data/sessions_mentee";
import { mockMenteePairings } from "../../../../data/ghep_cap";
import { SESSIONS } from "../../../../data/mockData";
import { useSessions } from "@/context/SessionsContext";

// ================== HELPER CHECK XUNG ĐỘT THỜI GIAN ==================
type SimpleRange = {
  date: string;  // "2024-05-10"
  start: string; // "10:00"
  end: string;   // "11:00"
};

/**
 * Parse chuỗi "YYYY-MM-DD HH:MM - HH:MM" thành SimpleRange
 */
function parseSimpleRange(timeStr: string): SimpleRange | null {
  if (!timeStr) return null;
  const parts = timeStr.split(" ");
  if (parts.length < 4) return null;
  const [date, start, , end] = parts;
  if (!date || !start || !end) return null;
  return { date, start, end };
}

/**
 * Hai khoảng thời gian có giao nhau (trùng lịch) hay không
 */
function isTimeConflict(a: SimpleRange, b: SimpleRange): boolean {
  if (a.date !== b.date) return false;
  const noOverlap = a.end <= b.start || b.end <= a.start;
  return !noOverlap;
}

/**
 * remaining = max - (current_from_SESSIONS + current_from_sessionList)
 *
 * - max: sức chứa tối đa của phiên (lấy từ raw)
 * - current_from_SESSIONS: số người đã đăng ký có sẵn trong mockData SESSIONS
 * - current_from_sessionList: số booking phát sinh bên FE (context), trừ phiên đã_hủy
 */
function getRemainingDisplay(raw: any, sessionList: Session[]): number | string {
  // 1) XÁC ĐỊNH max (sức chứa tối đa)
  let max: number | null = null;

  if (typeof raw.max === "number") {
    max = raw.max;
  } else if (typeof raw.capacity === "number") {
    max = raw.capacity;
  } else if (typeof raw.slotsTotal === "number") {
    max = raw.slotsTotal;
  } else if (
    typeof raw.current === "number" &&
    typeof raw.remaining === "number"
  ) {
    max = raw.current + raw.remaining;
  }

  // Không biết sức chứa ⇒ hiển thị "-"
  if (max == null) return "-";

  // 2) current gốc trong mockData
  let baseCurrent = 0;
  if (typeof raw.current === "number") {
    baseCurrent = raw.current;
  } else if (typeof raw.remaining === "number") {
    baseCurrent = max - raw.remaining;
  }

  // 3) current phát sinh từ sessionList (booking FE)
  const code = raw.code || raw.id || raw.sessionId;
  const time = raw.time || "";

  let extraCurrent = 0;
  if (code && time) {
    extraCurrent = sessionList.filter(
      (s) =>
        s.code === code &&
        s.time === time &&
        s.status !== "da_huy"
    ).length;
  }

  const totalCurrent = baseCurrent + extraCurrent;
  const remaining = max - totalCurrent;
  return remaining < 0 ? 0 : remaining;
}

/**
 * Màu status cho bảng (status tiếng Việt trong mockData)
 */
function getStatusClass(status: string): string {
  switch (status) {
    case "Sắp tới":
      return "bg-emerald-100 text-emerald-700";
    case "Đã diễn ra":
    case "Hoàn thành":
      return "bg-blue-100 text-blue-700";
    case "Đã hủy":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

// ================== PAGE COMPONENT ==================

export default function SearchSessionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const username: string = (user as any)?.username || "";

  // ✅ Dùng sessionList dùng chung cho toàn BKPortal
  const { sessionList, setSessionList } = useSessions();

  // ===== STATE UI =====
  const [search, setSearch] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [avoidConflict, setAvoidConflict] = useState<boolean>(false);

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ===== 1. TÌM TUTOR CỦA SINH VIÊN (từ ghep_cap) =====
  const pairing = (mockMenteePairings as any[]).find(
    (p) =>
      p.studentUsername === username ||
      p.studentId === username ||
      p.username === username
  );

  const currentTutor: string | null =
    (pairing &&
      (pairing.tutorUsername || pairing.tutorId || pairing.tutor)) ||
    null;

  // ===== 2. LỌC CÁC PHIÊN CỦA TUTOR ĐÓ (từ mockData.SESSIONS) =====
  let baseSessions: any[] = [];

  if (currentTutor) {
    baseSessions = (SESSIONS as any[]).filter((s) => {
      const tutorOfSession = s.tutor || s.tutorId || s.tutorUsername;
      if (tutorOfSession !== currentTutor) return false;

      // chỉ lấy các phiên "Sắp tới" (nếu mock có status)
      if (s.status && s.status !== "Sắp tới") return false;

      return true;
    });
  }

  // ===== 3. DỮ LIỆU ĐỂ CHECK XUNG ĐỘT: CÁC PHIÊN SẮP TỚI CỦA USER (từ context) =====
  const myUpcomingSessions = sessionList.filter(
    (s) =>
      s.username === username &&
      (s.status === "sap_toi" || s.status === "cho_xac_nhan")
  );

  const hasConflictWithUser = (timeStr: string): boolean => {
    const candidateRange = parseSimpleRange(timeStr);
    if (!candidateRange) return false;

    return myUpcomingSessions.some((b) => {
      const bookedRange = parseSimpleRange(b.time);
      return bookedRange ? isTimeConflict(candidateRange, bookedRange) : false;
    });
  };

  // ===== 4. OPTION FILTER (thời gian / chủ đề / hình thức) =====
  const uniqueDates = Array.from(
    new Set(
      baseSessions.map((s: any) => {
        const firstPart = (s.time || "").split(" ")[0];
        return firstPart.includes("-") ? firstPart : "Khác";
      })
    )
  );
  const uniqueTopics = Array.from(
    new Set(baseSessions.map((s: any) => s.title))
  );
  const uniqueMethods = Array.from(
    new Set(baseSessions.map((s: any) => s.format || s.method))
  );

  // ===== 5. FILTER THEO Ô LỌC + SEARCH + XUNG ĐỘT =====
  const filtered = baseSessions.filter((s: any) => {
    if (timeFilter !== "all") {
      const firstPart = (s.time || "").split(" ")[0];
      const datePart = firstPart.includes("-") ? firstPart : "Khác";
      if (datePart !== timeFilter) return false;
    }

    if (topicFilter !== "all" && s.title !== topicFilter) return false;

    const methodOfS = s.format || s.method || "";
    if (methodFilter !== "all" && methodOfS !== methodFilter) return false;

    if (avoidConflict && hasConflictWithUser(s.time || "")) return false;

    if (search.trim()) {
      const keyword = search.toLowerCase();
      const codeOfS = (s.code || s.id || "").toString().toLowerCase();
      const match =
        codeOfS.includes(keyword) ||
        (s.title || "").toLowerCase().includes(keyword) ||
        (s.time || "").toLowerCase().includes(keyword) ||
        (s.location || "").toLowerCase().includes(keyword);
      if (!match) return false;
    }

    return true;
  });

  // ===== 6. PHÂN TRANG =====
  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageSessions = filtered.slice(startIndex, endIndex);

  const handleRowsPerPage = (value: string) => {
    const n = Number(value) || 5;
    setRowsPerPage(n);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };
  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  // ===== 7. XỬ LÝ NÚT "ĐẶT CHỖ" (chỉ dùng sessionList) =====
  const handleBook = (raw: any) => {
    if (!username) {
      alert("Bạn cần đăng nhập để đặt chỗ.");
      return;
    }

    const code = raw.code || raw.id || raw.sessionId;
    if (!code) {
      alert("Không xác định được mã phiên.");
      return;
    }

    const time = raw.time || "";

    // 1) Check còn chỗ hay không (dựa trên context hiện tại)
    const remaining = getRemainingDisplay(raw, sessionList);
    if (typeof remaining === "number" && remaining <= 0) {
      alert("Phiên này đã hết chỗ, không thể đăng ký.");
      return;
    }

    // 2) Check đã đăng ký đúng phiên này chưa
    const alreadyBooked = sessionList.some(
      (s) =>
        s.username === username &&
        s.code === code &&
        s.time === time &&
        s.status !== "da_huy"
    );
    if (alreadyBooked) {
      alert("Bạn đã đăng ký phiên này rồi.");
      return;
    }

    // 3) Check xung đột lịch với các phiên sắp tới
    if (hasConflictWithUser(time)) {
      alert(
        "Phiên này trùng thời gian với một phiên bạn đã đăng ký. Vui lòng chọn phiên khác"
      );
      return;
    }

    // 4) Tạo booking mới ngay trên context
    const newBooking: Session = {
      code,
      title: raw.title || "",
      time,
      method: raw.method || raw.format || "Trực tiếp",
      location: raw.location || "",
      status: "sap_toi",
      username,
    };

    setSessionList((prev) => [...prev, newBooking]);

    alert("Đặt chỗ thành công!");
    router.push("/dashboard/student/my-booking");
  };

  // ================== RENDER ==================
  return (
    <div className="min-h-full bg-[#F4F6F9] px-6 py-6">
      {/* HEADER */}
      <div className="mb-6">
        <p className="mb-1 text-xs text-gray-500">
          Ứng dụng <span className="font-medium text-gray-700">BKPortal</span>
        </p>
        <h1 className="text-xl font-semibold text-gray-900">
          Tìm kiếm & đăng ký phiên
        </h1>
      </div>

      {/* Nếu không tìm được tutor ghép cặp */}
      {!currentTutor && (
        <div className="rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-800 border border-yellow-200">
          Không tìm được tutor đang ghép cặp cho sinh viên hiện tại. Vui lòng
          kiểm tra lại dữ liệu ghép cặp (<code>ghep_cap.ts</code>).
        </div>
      )}

      {currentTutor && (
        <>
          {/* FILTER BAR */}
          <div className="mt-4 mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="w-full lg:max-w-xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Tìm kiếm theo Mã phiên, Chủ đề, Thời gian..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filters + checkbox */}
            <div className="flex w-full flex-col gap-3 lg:w-auto">
              <div className="flex flex-wrap gap-2">
                {/* Thời gian */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Thời gian:</span>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">Tất cả</option>
                    {uniqueDates.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chủ đề */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Chủ đề:</span>
                  <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="max-w-[220px] rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">Tất cả</option>
                    {uniqueTopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hình thức */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Hình thức:</span>
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">Tất cả</option>
                    {uniqueMethods.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={avoidConflict}
                  onChange={(e) => setAvoidConflict(e.target.checked)}
                />
                <span>
                  Loại bỏ các phiên trùng thời gian với lịch đã đăng ký
                </span>
              </label>
            </div>
          </div>

          {/* TABLE PHIÊN KHẢ DỤNG */}
          <div className="overflow-hidden rounded-md bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Mã phiên
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Chủ đề
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Thời gian
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Hình thức
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Địa điểm
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Sức chứa còn
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Trạng thái
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {totalRows === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        Không có phiên phù hợp.
                      </td>
                    </tr>
                  )}

                  {pageSessions.map((s: any) => {
                    const remaining = getRemainingDisplay(s, sessionList);
                    const statusText = s.status || "Sắp tới";

                    return (
                      <tr
                        key={s.id || s.code || s.sessionId}
                        className="hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {s.code || s.id || s.sessionId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {s.title}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                          {s.time}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                          {s.format || s.method}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {s.location}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                          {remaining}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                              statusText
                            )}`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <button
                            className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                            onClick={() => handleBook(s)}
                          >
                            Đặt chỗ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* FOOTER PAGINATION */}
            <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span>Số hàng mỗi trang:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => handleRowsPerPage(e.target.value)}
                  className="rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3">
                <span>
                  {totalPages === 0 ? 0 : currentPage}{" "}
                  <span className="text-gray-400">trên</span> {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || totalPages === 0}
                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
