"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, X as XIcon } from "lucide-react";

import { Session } from "@/data/sessions_mentee";
import { mockMenteePairings } from "@/data/ghep_cap";
import { SESSIONS } from "@/data/mockData";

interface ChooseNewSessionModalProps {
  open: boolean;
  sessionToChange: Session | null;
  studentUsername: string | undefined; // username sinh viên hiện tại
  studentUpcomingSessions: Session[];  // ✅ CÁC PHIÊN SẮP TỚI CỦA SV (DÙNG CHECK XUNG ĐỘT)
  onClose: () => void;
  onChoose: (oldSession: Session, newSession: Session) => void;
}

/* ========= HELPER CHECK XUNG ĐỘT THỜI GIAN (THEO KHOẢNG) ========== */

type SimpleRange = {
  date: string;  // "YYYY-MM-DD"
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
};

// Parse chuỗi "YYYY-MM-DD HH:MM - HH:MM"
function parseSimpleRange(timeStr: string): SimpleRange | null {
  if (!timeStr) return null;
  const parts = timeStr.split(" ");
  if (parts.length < 4) return null;

  const [date, start, , end] = parts; // bỏ dấu "-"
  if (!date || !start || !end) return null;

  return { date, start, end };
}

// Kiểm tra 2 khoảng thời gian có overlap không (cùng ngày)
function isTimeConflict(a: SimpleRange, b: SimpleRange): boolean {
  if (a.date !== b.date) return false;
  const noOverlap = a.end <= b.start || b.end <= a.start;
  return !noOverlap;
}

export function ChooseNewSessionModal({
  open,
  sessionToChange,
  studentUsername,
  studentUpcomingSessions,
  onClose,
  onChoose,
}: ChooseNewSessionModalProps) {
  // ================== HOOKS (luôn gọi, KHÔNG phụ thuộc open) ==================
  const [search, setSearch] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [avoidConflict, setAvoidConflict] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"sap_toi" | "hoan_thanh">(
    "sap_toi"
  );

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ================== HELPER ==================
  const getRemainingSlots = (s: any): string | number => {
    if (s.remaining != null) return s.remaining;
    if (s.slotsRemaining != null) return s.slotsRemaining;
    if (typeof s.max === "number" && typeof s.current === "number") {
      return s.max - s.current;
    }
    return "-";
  };

  const getStatusClass = (status: string): string => {
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
  };

  const mapRawToSession = (raw: any): Session => {
    const statusText: string = raw.status || "Sắp tới";
    let statusInternal: any = "sap_toi";
    if (statusText === "Đã diễn ra" || statusText === "Hoàn thành")
      statusInternal = "hoan_thanh";
    if (statusText === "Đã hủy") statusInternal = "da_huy";

    return {
      ...(raw as any),
      code: raw.code || raw.id || "",
      title: raw.title || "",
      time: raw.time || "",
      method: raw.method || raw.format || "",
      location: raw.location || "",
      status: statusInternal,
    } as Session;
  };

  // ================== TÌM TUTOR & THÔNG TIN PHIÊN HIỆN TẠI ==================
  const pairing = (mockMenteePairings as any[]).find(
    (p) =>
      p.studentUsername === studentUsername ||
      p.studentId === studentUsername ||
      p.username === studentUsername
  );

  let fallbackTutorFromSession: string | null = null;
  let currentCode: string | null = null;

  if (sessionToChange) {
    const anySession = sessionToChange as any;
    fallbackTutorFromSession =
      anySession.tutor || anySession.tutorUsername || anySession.tutorId || null;

    currentCode =
      anySession.code || anySession.id || anySession.sessionId || null;
  }

  const currentTutor: string | null =
    (pairing
      ? pairing.tutorUsername || pairing.tutorId || pairing.tutor
      : null) || fallbackTutorFromSession;

  // ================== LỌC PHIÊN CỦA TUTOR TRONG mock SESSIONS ==================
  let baseSessions: any[] = [];

  if (currentTutor) {
    baseSessions = (SESSIONS as any[]).filter((s) => {
      const tutorOfSession = s.tutor || s.tutorId || s.tutorUsername;
      if (tutorOfSession !== currentTutor) return false;

      const codeOfS = s.code || s.id || s.sessionId;
      if (currentCode && codeOfS === currentCode) return false; // ❗ không cho chọn lại chính nó

      // chỉ lấy phiên "Sắp tới"
      if (s.status && s.status !== "Sắp tới") return false;

      return true;
    });
  }

  // ================== OPTION FILTER ==================
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

  // ================== FILTER THEO Ô LỌC + SEARCH ==================
  const filtered = baseSessions.filter((s: any) => {
    if (activeTab === "hoan_thanh" && s.status !== "Hoàn thành") return false;
    if (activeTab === "sap_toi" && s.status && s.status !== "Sắp tới")
      return false;

    if (timeFilter !== "all") {
      const firstPart = (s.time || "").split(" ")[0];
      const datePart = firstPart.includes("-") ? firstPart : "Khác";
      if (datePart !== timeFilter) return false;
    }

    if (topicFilter !== "all" && s.title !== topicFilter) return false;

    const methodOfS = s.format || s.method || "";
    if (methodFilter !== "all" && methodOfS !== methodFilter) return false;

    // ✅ LOẠI BỎ XUNG ĐỘT LỊCH CÁ NHÂN (KHÔNG TÍNH PHIÊN HIỆN TẠI)
    if (avoidConflict && studentUpcomingSessions?.length > 0) {
      const candidateRange = parseSimpleRange(s.time || "");
      if (candidateRange) {
        const hasConflict = studentUpcomingSessions.some((booked) => {
          // ❗ BỎ PHIÊN ĐANG ĐỔI (session hiện tại) KHI CHECK
          if (
            sessionToChange &&
            booked.code === sessionToChange.code &&
            booked.time === sessionToChange.time
          ) {
            return false;
          }

          const bookedRange = parseSimpleRange(booked.time || "");
          return bookedRange ? isTimeConflict(candidateRange, bookedRange) : false;
        });

        if (hasConflict) return false;
      }
    }

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

  // ================== PHÂN TRANG ==================
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

  // ================== CÁC NHÁNH RETURN (sau khi HOOKS đã chạy) ==================

  // Không mở hoặc chưa có session cần đổi → không render gì
  if (!open || !sessionToChange) {
    return null;
  }

  // Không tìm được tutor → hiện modal báo lỗi
  if (!currentTutor) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="w-full max-w-md rounded-lg bg-white px-6 py-5 shadow-lg">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-[15px] font-semibold text-gray-900">
              Chọn phiên mới
            </h2>
            <button
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              onClick={onClose}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-700">
            Không tìm được tutor đang ghép cặp cho sinh viên hiện tại, nên
            không thể tải danh sách phiên mới. Vui lòng kiểm tra lại dữ liệu
            ghép cặp (<code>ghep_cap.ts</code>).
          </p>
          <div className="mt-6 flex justify-end">
            <button
              className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================== RENDER MODAL CHÍNH ==================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-4xl rounded-lg bg-white px-6 py-5 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">
            Chọn phiên mới
          </h2>
          <button
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Filter row */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            {/* search */}
            <div className="w-full md:max-w-xs">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Tìm kiếm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* 4 dropdown */}
            <div className="flex flex-wrap gap-2">
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

              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="max-w-[150px] rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Tất cả</option>
                {uniqueTopics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

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

              {/* dropdown giả cho giống UI */}
              <select className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option>Tất cả</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={avoidConflict}
                onChange={(e) => setAvoidConflict(e.target.checked)}
              />
              <span>Loại bỏ xung đột cho cá nhân</span>
            </label>

            <div className="flex rounded bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("sap_toi")}
                className={`rounded px-3 py-1 text-xs font-medium ${
                  activeTab === "sap_toi"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                Sắp tới
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hoan_thanh")}
                className={`rounded px-3 py-1 text-xs font-medium ${
                  activeTab === "hoan_thanh"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>

        {/* TABLE PHIÊN MỚI */}
        <div className="overflow-hidden rounded-md border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Mã phiên
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Chủ đề
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Thời gian
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Hình thức
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Địa điểm
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Sức chứa còn
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-semibold uppercase tracking-wide text-gray-500">
                    Trạng thái
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-right font-semibold uppercase tracking-wide text-gray-500">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {totalRows === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-4 text-center text-xs text-gray-500"
                    >
                      Không có phiên phù hợp.
                    </td>
                  </tr>
                )}

                {pageSessions.map((s: any) => (
                  <tr key={s.id || s.code} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                      {s.id || s.code}
                    </td>
                    <td className="px-4 py-2 text-gray-900">{s.title}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-800">
                      {s.time}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-800">
                      {s.format || s.method}
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                      {s.location}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-800">
                      {getRemainingSlots(s)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                          s.status || "Sắp tới"
                        )}`}
                      >
                        {s.status || "Sắp tới"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-right">
                      <button
                        className="rounded bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-indigo-700"
                        onClick={() =>
                          onChoose(sessionToChange, mapRawToSession(s))
                        }
                      >
                        Đổi chỗ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* footer phân trang */}
          <div className="flex flex-col gap-2 border-t border-gray-200 px-4 py-2 text-[11px] text-gray-600 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span>Số hàng mỗi trang:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPage(e.target.value)}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  disabled={currentPage === 1 || totalRows === 0}
                  className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalRows === 0}
                  className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
