"use client";

import { useState } from "react";
import { X as XIcon } from "lucide-react";
import { mockSessions, Session, SessionStatus } from "../../../../data/sessions_mentee";

interface ConfirmCancelModalProps {
  open: boolean;
  session: Session | null;
  onClose: () => void;
  onConfirm: (session: Session, reason: string) => void;
}

export function ConfirmCancelModal({
  open,
  session,
  onClose,
  onConfirm,
}: ConfirmCancelModalProps) {
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!open || !session) return null;

  const handleConfirmClick = () => {
    if (!reason.trim()) {
      setError("Bạn phải nhập lý do để hệ thống ghi nhận.");
      return;
    }
    onConfirm(session, reason.trim());
    setReason("");
    setError(null);
  };

  const handleClose = () => {
    setReason("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg bg-white px-6 py-5 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">
            Xác nhận hủy chỗ
          </h2>
          <button
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={handleClose}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="space-y-4 text-sm text-gray-800">
          <p className="text-sm font-medium text-gray-900">Thông tin phiên:</p>

          <div className="rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
            <div className="grid grid-cols-[95px,1fr] gap-y-1.5">
              <span className="text-gray-600">Mã phiên:</span>
              <span className="font-medium">{session.code}</span>

              <span className="text-gray-600">Chủ đề:</span>
              <span className="font-medium">{session.title}</span>

              <span className="text-gray-600">Thời gian:</span>
              <span>{session.time}</span>

              <span className="text-gray-600">Hình thức:</span>
              <span>{session.method}</span>

              <span className="text-gray-600">Địa điểm:</span>
              <span>{session.location}</span>
            </div>
          </div>

          <p className="text-xs font-medium text-red-500">
            Sau khi hủy chỗ của bạn sẽ được nhường cho sinh viên khác
          </p>

          <div>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(null);
              }}
              rows={3}
              className="w-full rounded border border-red-300 px-3 py-2 text-sm text-gray-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-gray-400"
              placeholder="Nhập lý do của bạn..."
            />
            <p className="mt-1 text-[11px] text-gray-500">
              Bạn phải nhập lý do để hệ thống ghi nhận
            </p>
            {error && (
              <p className="mt-1 text-[11px] text-red-500">{error}</p>
            )}
          </div>
        </div>

        {/* Footer nút */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
            onClick={handleClose}
          >
            Hủy
          </button>
          <button
            className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            onClick={handleConfirmClick}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
