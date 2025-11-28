"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, X as XIcon } from "lucide-react";

import { useSessions } from "@/context/SessionsContext";
import { useAuth } from "@/context/AuthContext";
import {
  Session,
  SessionStatus,
} from "../../../../data/sessions_mentee";
import { ChooseNewSessionModal } from "./ChooseNewSessionModal";

type ActionType = "reschedule" | "cancel" | null;

/* =========================================================
   HELPER CHO LOGIC ĐỔI PHIÊN
========================================================= */

type SimpleRange = {
  date: string;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
};

// Parse "2024-05-11 14:00 - 15:30" -> { date, start, end }
function parseSimpleRange(timeStr: string): SimpleRange | null {
  if (!timeStr) return null;
  const parts = timeStr.split(" ");
  if (parts.length < 4) return null;

  const [date, start, , end] = parts;
  if (!date || !start || !end) return null;

  return { date, start, end };
}

// So sánh time range theo chuỗi "HH:MM" (đã padding 0)
function isTimeConflict(a: SimpleRange, b: SimpleRange): boolean {
  if (a.date !== b.date) return false;
  const noOverlap = a.end <= b.start || b.end <= a.start;
  return !noOverlap;
}

// Lấy số slot còn lại nếu data có các field liên quan
function getRemainingFromSession(s: any): number | null {
  if (typeof s.remaining === "number") return s.remaining;
  if (typeof s.slotsRemaining === "number") return s.slotsRemaining;
  if (typeof s.max === "number" && typeof s.current === "number") {
    return s.max - s.current;
  }
  return null;
}

/* =========================================================
   COMPONENT CHÍNH
========================================================= */

export default function MyBookingPage() {
  const { user } = useAuth();
  const username: string | undefined = (user as any)?.username;

  // ✅ Lấy sessionList dùng chung từ Context
  const { sessionList, setSessionList } = useSessions();

  // ================== STATE LIST CHÍNH ==================
  const [activeTab, setActiveTab] =
    useState<"sap_toi" | "hoan_thanh" | "da_huy">("sap_toi");
  const [search, setSearch] = useState("");

  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ================== STATE POPUP XÁC NHẬN ==================
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    type: ActionType;
    session: Session | null;
  }>({
    open: false,
    type: null,
    session: null,
  });

  const [cancelReason, setCancelReason] = useState<string>("");
  const [cancelError, setCancelError] = useState<string | null>(null);

  // ================== STATE POPUP "CHỌN PHIÊN MỚI" ==================
  const [chooseNewOpen, setChooseNewOpen] = useState<boolean>(false);
  const [sessionToChange, setSessionToChange] = useState<Session | null>(null);

  // ================== TÍNH LIST PHIÊN CỦA SINH VIÊN HIỆN TẠI ==================
  const SESSIONS: Session[] = username
    ? sessionList.filter((s) => s.username === username)
    : sessionList;

  // ================== DANH SÁCH PHIÊN SẮP TỚI CỦA SV (DÙNG ĐỂ CHECK XUNG ĐỘT) ==================
  const myUpcomingForConflict: Session[] = username
    ? sessionList.filter(
        (s) =>
          s.username === username &&
          (s.status === "sap_toi" || s.status === "cho_xac_nhan")
      )
    : [];

  // ================== FILTER CHO LIST CHÍNH ==================
  const uniqueDates = Array.from(
    new Set(
      SESSIONS.map((s) => {
        const firstPart = s.time.split(" ")[0];
        return firstPart.includes("-") ? firstPart : "Khác";
      })
    )
  );
  const uniqueTopics = Array.from(new Set(SESSIONS.map((s) => s.title)));
  const uniqueMethods = Array.from(new Set(SESSIONS.map((s) => s.method)));

  const filteredSessions = SESSIONS.filter((s) => {
    // Tab "Hoàn thành"
    if (activeTab === "hoan_thanh" && s.status !== "hoan_thanh") return false;

    // Tab "Đã hủy"
    if (activeTab === "da_huy" && s.status !== "da_huy") return false;

    // Tab "Sắp tới" → chỉ Sắp tới + Chờ xác nhận
    if (
      activeTab === "sap_toi" &&
      !["sap_toi", "cho_xac_nhan"].includes(s.status)
    ) {
      return false;
    }

    if (timeFilter !== "all") {
      const firstPart = s.time.split(" ")[0];
      const datePart = firstPart.includes("-") ? firstPart : "Khác";
      if (datePart !== timeFilter) return false;
    }

    if (topicFilter !== "all" && s.title !== topicFilter) return false;
    if (methodFilter !== "all" && s.method !== methodFilter) return false;

    if (search.trim()) {
      const keyword = search.toLowerCase();
      const match =
        s.code.toLowerCase().includes(keyword) ||
        s.title.toLowerCase().includes(keyword) ||
        s.time.toLowerCase().includes(keyword) ||
        s.location.toLowerCase().includes(keyword);
      if (!match) return false;
    }

    return true;
  });

  const statusLabel: Record<SessionStatus, string> = {
    sap_toi: "Sắp tới",
    hoan_thanh: "Hoàn thành",
    da_huy: "Đã hủy",
    cho_xac_nhan: "Chờ xác nhận",
  };

  const statusClass: Record<SessionStatus, string> = {
    sap_toi: "bg-emerald-100 text-emerald-700",
    hoan_thanh: "bg-blue-100 text-blue-700",
    da_huy: "bg-red-100 text-red-700",
    cho_xac_nhan: "bg-yellow-100 text-yellow-700",
  };

  // ================== PHÂN TRANG LIST CHÍNH ==================
  const totalRows = filteredSessions.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageSessions = filteredSessions.slice(startIndex, endIndex);

  // ================== POPUP XÁC NHẬN ==================
  const openConfirm = (type: ActionType, session: Session) => {
    setConfirmAction({
      open: true,
      type,
      session,
    });
    if (type === "cancel") {
      setCancelReason("");
      setCancelError(null);
    }
  };

  const closeConfirm = () => {
    setConfirmAction({
      open: false,
      type: null,
      session: null,
    });
    setCancelReason("");
    setCancelError(null);
  };

  // Xác nhận hủy chỗ → đổi trạng thái sang "da_huy"
  const handleConfirmCancel = () => {
    if (!confirmAction.session || confirmAction.type !== "cancel") return;

    if (!cancelReason.trim()) {
      setCancelError("Bạn phải nhập lý do để hệ thống ghi nhận.");
      return;
    }

    console.log("Hủy chỗ", confirmAction.session.code, cancelReason);

    setSessionList((prev: Session[]): Session[] =>
      prev.map((item): Session =>
        item.code === confirmAction.session!.code &&
        (!username || item.username === username)
          ? { ...item, status: "da_huy" as SessionStatus }
          : item
      )
    );

    closeConfirm();
  };

  // bấm "Chọn phiên mới" → đóng popup 1, mở popup 2
  const openChooseNewFromConfirm = () => {
    if (!confirmAction.session) return;
    setSessionToChange(confirmAction.session);
    setConfirmAction({
      open: false,
      type: null,
      session: null,
    });
    setChooseNewOpen(true);
  };

  const handleChangeRowsPerPage = (value: string) => {
    const n = Number(value) || 5;
    setRowsPerPage(n);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // ================== CALLBACK ĐỔI PHIÊN (NHẬN TỪ MODAL) ==================
  const handleChooseNewSession = (oldSession: Session, target: Session) => {
    if (!username) return;

    console.log(
      "Đổi từ phiên",
      oldSession.code,
      "sang phiên",
      target.code
    );

    // 1) Check còn slot ở phiên mới
    const remaining = getRemainingFromSession(target as any);
    if (remaining !== null && remaining <= 0) {
      alert("Phiên mới đã đủ số lượng, bạn không thể đổi sang phiên này.");
      return;
    }

    // 2) Check xung đột lịch với các phiên sắp tới khác (bỏ phiên cũ)
    const rangeNew = parseSimpleRange(target.time || "");
    if (rangeNew) {
      const myUpcoming = myUpcomingForConflict.filter(
        (s) => !(s.code === oldSession.code && s.time === oldSession.time)
      );

      const conflict = myUpcoming.some((b) => {
        const r = parseSimpleRange(b.time);
        return r && isTimeConflict(rangeNew, r);
      });

      if (conflict) {
        alert(
          "Phiên mới bị trùng thời gian với một phiên khác bạn đã đăng ký. Vui lòng chọn phiên khác."
        );
        return;
      }
    }

    // 3) Không xung đột + còn slot → cập nhật sessionList
    setSessionList((prev: Session[]): Session[] => {
      // 3.1) Phiên cũ -> đã hủy
      const updated: Session[] = prev.map((item): Session =>
        item.code === oldSession.code && item.username === username
          ? { ...item, status: "da_huy" as SessionStatus }
          : item
      );

      // 3.2) Kiểm tra xem user đã có bản ghi với phiên target chưa
      const idxExisting = updated.findIndex(
        (item) => item.code === target.code && item.username === username
      );

      if (idxExisting !== -1) {
        // Đã có bản ghi → mở lại thành "Sắp tới"
        const existing = updated[idxExisting];
        updated[idxExisting] = {
          ...existing,
          status: "sap_toi" as SessionStatus,
        };
        return updated;
      }

      // 3.3) Chưa có → thêm bản ghi mới
      const newBooking: Session = {
        ...target,
        username,
        status: "sap_toi" as SessionStatus,
      };

      return [...updated, newBooking];
    });

    setChooseNewOpen(false);
    setSessionToChange(null);
  };

  const closeChooseNew = () => {
    setChooseNewOpen(false);
    setSessionToChange(null);
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
          Danh sách phiên đã đăng ký
        </h1>
      </div>

      {/* FILTER BAR */}
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        {/* Filters + Tabs */}
        <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-2 lg:w-auto">
          {/* 3 dropdown filter */}
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

          {/* Tabs */}
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
            <button
              type="button"
              onClick={() => setActiveTab("da_huy")}
              className={`rounded px-3 py-1 text-xs font-medium ${
                activeTab === "da_huy"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              Đã hủy
            </button>
          </div>
        </div>
      </div>

      {/* TABLE CHÍNH */}
      <div className="overflow-hidden rounded-md bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Mã phiên ↑↓
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Chủ đề ↑↓
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Thời gian ↑↓
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Hình thức ↑↓
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Địa điểm ↑↓
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Trạng thái ↑↓
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
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Không tìm thấy phiên phù hợp.
                  </td>
                </tr>
              )}

              {pageSessions.map((s) => {
                const canChange =
                  s.status === "sap_toi" || s.status === "cho_xac_nhan";

                return (
                  <tr key={s.code} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {s.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {s.title}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                      {s.time}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                      {s.method}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {s.location}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[s.status]}`}
                      >
                        {statusLabel[s.status]}
                      </span>
                    </td>
                    {/* Chỉ Sắp tới / Chờ xác nhận mới có nút */}
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {canChange && (
                        <div className="inline-flex gap-2">
                          <button
                            className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                            onClick={() => openConfirm("reschedule", s)}
                          >
                            Đổi phiên
                          </button>
                          <button
                            className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                            onClick={() => openConfirm("cancel", s)}
                          >
                            Hủy chỗ
                          </button>
                        </div>
                      )}
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
              onChange={(e) => handleChangeRowsPerPage(e.target.value)}
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

      {/* POPUP 1: XÁC NHẬN ĐỔI LỊCH / HỦY CHỖ */}
      {confirmAction.open && confirmAction.session && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-lg bg-white px-6 py-5 shadow-lg">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-[15px] font-semibold text-gray-900">
                {confirmAction.type === "reschedule"
                  ? "Xác nhận đổi lịch"
                  : "Xác nhận hủy chỗ"}
              </h2>
              <button
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                onClick={closeConfirm}
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Nội dung ĐỔI LỊCH */}
            {confirmAction.type === "reschedule" && (
              <div className="space-y-4 text-sm text-gray-800">
                <div className="grid grid-cols-[110px,1fr] gap-y-1.5">
                  <span className="text-gray-600">Mã buổi học:</span>
                  <span className="font-medium">
                    {confirmAction.session.code}
                  </span>

                  <span className="text-gray-600">Chủ đề:</span>
                  <span className="font-medium">
                    {confirmAction.session.title}
                  </span>

                  <span className="text-gray-600">Thời gian:</span>
                  <span>{confirmAction.session.time}</span>

                  <span className="text-gray-600">Hình thức:</span>
                  <span>{confirmAction.session.method}</span>

                  <span className="text-gray-600">Địa điểm:</span>
                  <span>{confirmAction.session.location}</span>
                </div>

                <p className="text-sm text-gray-700">
                  Bạn có chắc muốn đổi sang phiên khác không? Phiên hiện tại sẽ
                  bị hủy.
                </p>
              </div>
            )}

            {/* Nội dung HỦY CHỖ */}
            {confirmAction.type === "cancel" && (
              <div className="space-y-4 text-sm text-gray-800">
                <p className="text-sm font-medium text-gray-900">
                  Thông tin phiên:
                </p>

                <div className="rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                  <div className="grid grid-cols-[95px,1fr] gap-y-1.5">
                    <span className="text-gray-600">Mã phiên:</span>
                    <span className="font-medium">
                      {confirmAction.session.code}
                    </span>

                    <span className="text-gray-600">Chủ đề:</span>
                    <span className="font-medium">
                      {confirmAction.session.title}
                    </span>

                    <span className="text-gray-600">Thời gian:</span>
                    <span>{confirmAction.session.time}</span>

                    <span className="text-gray-600">Hình thức:</span>
                    <span>{confirmAction.session.method}</span>

                    <span className="text-gray-600">Địa điểm:</span>
                    <span>{confirmAction.session.location}</span>
                  </div>
                </div>

                <p className="text-xs font-medium text-red-500">
                  Sau khi hủy chỗ của bạn sẽ được nhường cho sinh viên khác
                </p>

                <div>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => {
                      setCancelReason(e.target.value);
                      setCancelError(null);
                    }}
                    rows={3}
                    className="w-full rounded border border-red-300 px-3 py-2 text-sm text-gray-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-gray-400"
                    placeholder="Nhập lý do của bạn..."
                  />
                  <p className="mt-1 text-[11px] text-gray-500">
                    Bạn phải nhập lý do để hệ thống ghi nhận
                  </p>
                  {cancelError && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {cancelError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Footer nút */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                onClick={closeConfirm}
              >
                {confirmAction.type === "reschedule"
                  ? "Hủy thao tác"
                  : "Hủy"}
              </button>
              <button
                className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                onClick={
                  confirmAction.type === "cancel"
                    ? handleConfirmCancel
                    : openChooseNewFromConfirm
                }
              >
                {confirmAction.type === "reschedule"
                  ? "Chọn phiên mới"
                  : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: CHỌN PHIÊN MỚI */}
      <ChooseNewSessionModal
        open={chooseNewOpen}
        sessionToChange={sessionToChange}
        studentUsername={username}
        studentUpcomingSessions={myUpcomingForConflict}
        onClose={closeChooseNew}
        onChoose={handleChooseNewSession}
      />
    </div>
  );
}
