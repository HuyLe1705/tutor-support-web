"use client";

import { X as XIcon } from "lucide-react";
import { mockSessions, Session, SessionStatus } from "../../../../data/sessions_mentee";

interface ConfirmRescheduleModalProps {
  open: boolean;
  session: Session | null;
  onClose: () => void;
  onChooseNew: (session: Session) => void;
}

export function ConfirmRescheduleModal({
  open,
  session,
  onClose,
  onChooseNew,
}: ConfirmRescheduleModalProps) {
  if (!open || !session) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg bg-white px-6 py-5 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">
            Xác nhận đổi lịch
          </h2>
          <button
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="space-y-4 text-sm text-gray-800">
          <div className="grid grid-cols-[110px,1fr] gap-y-1.5">
            <span className="text-gray-600">Mã buổi học:</span>
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

          <p className="text-sm text-gray-700">
            Bạn có chắc muốn đổi sang phiên khác không? Phiên hiện tại sẽ bị
            hủy.
          </p>
        </div>

        {/* Footer nút */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Hủy thao tác
          </button>
          <button
            className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            onClick={() => onChooseNew(session)}
          >
            Chọn phiên mới
          </button>
        </div>
      </div>
    </div>
  );
}
