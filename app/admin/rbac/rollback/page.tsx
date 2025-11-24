// app/admin/rbac/rollback/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  History,
  AlertTriangle,
  CheckCircle2,
  Info,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type RiskLevel = "low" | "medium" | "high";

type PolicyVersion = {
  id: string;
  version: number;
  createdAt: string;
  createdBy: string;
  description: string;
  isCurrent: boolean;
  riskLevel: RiskLevel;
  affectedRoles: number;
  affectedUsersApprox: number;
};

const MOCK_VERSIONS: PolicyVersion[] = [
  {
    id: "v5",
    version: 5,
    createdAt: "2025-11-20 14:22",
    createdBy: "system",
    description: "Tự động sync với HCMUT_DATACORE · chuẩn hoá quyền Admin",
    isCurrent: true,
    riskLevel: "low",
    affectedRoles: 4,
    affectedUsersApprox: 1200,
  },
  {
    id: "v4",
    version: 4,
    createdAt: "2025-11-18 08:00",
    createdBy: "admin",
    description: "Thêm quyền export báo cáo cho Coordinator",
    isCurrent: false,
    riskLevel: "low",
    affectedRoles: 1,
    affectedUsersApprox: 200,
  },
  {
    id: "v3",
    version: 3,
    createdAt: "2025-11-10 09:30",
    createdBy: "admin",
    description: "Giới hạn quyền RBAC_MAPPING chỉ cho Admin",
    isCurrent: false,
    riskLevel: "medium",
    affectedRoles: 2,
    affectedUsersApprox: 50,
  },
  {
    id: "v2",
    version: 2,
    createdAt: "2025-11-01 10:15",
    createdBy: "admin",
    description: "Mở rộng quyền SESSION_MANAGE cho Tutor",
    isCurrent: false,
    riskLevel: "high",
    affectedRoles: 1,
    affectedUsersApprox: 300,
  },
];

type DryRunResult =
  | { status: "idle" }
  | {
      status: "ok" | "risk";
      riskLevel: RiskLevel;
      message: string;
      details: string[];
    };

export default function RbacRollbackPage() {
  const [versions, setVersions] = useState<PolicyVersion[]>(MOCK_VERSIONS);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    MOCK_VERSIONS.find((v) => !v.isCurrent)?.id ?? null
  );
  const [dryRunResult, setDryRunResult] = useState<DryRunResult>({
    status: "idle",
  });
  const [isApplying, setIsApplying] = useState(false);

  const selectedVersion = useMemo(
    () => versions.find((v) => v.id === selectedVersionId) ?? null,
    [versions, selectedVersionId]
  );

  const currentVersion = useMemo(
    () => versions.find((v) => v.isCurrent) ?? null,
    [versions]
  );

  const canRollback = !!selectedVersion && !selectedVersion.isCurrent;

  const handleDryRun = () => {
    if (!selectedVersion) {
      alert("Vui lòng chọn một phiên bản cần rollback.");
      return;
    }

    // Demo logic: dựa vào riskLevel của version được chọn
    if (selectedVersion.riskLevel === "low") {
      setDryRunResult({
        status: "ok",
        riskLevel: "low",
        message:
          "Dry-run thành công. Không phát hiện rủi ro tương thích đáng kể.",
        details: [
          "Các role & permission hoàn toàn tương thích với schema hiện tại.",
          "Không có sự khác biệt về số lượng role so với phiên bản hiện tại.",
          "Các quyền nhạy cảm (RBAC_MAPPING, RBAC_ROLLBACK) vẫn được giữ ở Admin.",
        ],
      });
    } else if (selectedVersion.riskLevel === "medium") {
      setDryRunResult({
        status: "risk",
        riskLevel: "medium",
        message:
          "Dry-run cho thấy có một số thay đổi có rủi ro trung bình, cần xác nhận kỹ trước khi rollback.",
        details: [
          "Một số role bị giảm quyền SESSION_MANAGE, có thể ảnh hưởng tới việc đổi lịch/hủy phiên.",
          "Có thay đổi quyền REPORT_EXPORT cho một số Coordinator.",
          "Đề xuất: thông báo trước cho các khoa liên quan trước khi áp dụng.",
        ],
      });
    } else {
      setDryRunResult({
        status: "risk",
        riskLevel: "high",
        message:
          "Dry-run phát hiện rủi ro cao. Rollback có thể làm mất quyền cần thiết của nhiều người dùng.",
        details: [
          "Version này giảm quyền của Tutor trên toàn hệ, có thể làm gián đoạn việc quản lý buổi học.",
          "Nhiều user đang phụ thuộc vào quyền mới ở version hiện tại.",
          "Khuyến nghị: không rollback trực tiếp, chỉ dùng để tham khảo và tạo version mới điều chỉnh.",
        ],
      });
    }
  };

  const handleApplyRollback = () => {
    if (!selectedVersion) {
      alert("Vui lòng chọn một phiên bản cần rollback.");
      return;
    }

    // Thực tế: bắt buộc chạy dry-run trước khi cho rollback (theo alternative flow). :contentReference[oaicite:3]{index=3}
    if (dryRunResult.status === "idle") {
      const ok = confirm(
        "Bạn chưa chạy dry-run. Bạn có chắc muốn rollback trực tiếp không?"
      );
      if (!ok) return;
    }

    if (dryRunResult.status === "risk") {
      const ok = confirm(
        "Dry-run báo có rủi ro. Bạn vẫn muốn áp dụng rollback phiên bản này?"
      );
      if (!ok) return;
    }

    setIsApplying(true);

    // Demo: giả lập áp dụng thành công + tạo snapshot mới (version + 1) theo UC-N2. :contentReference[oaicite:4]{index=4}
    setTimeout(() => {
      const now = new Date();
      const timestamp = now.toLocaleString("vi-VN");

      setVersions((prev) => {
        const updated = prev.map((v) => ({
          ...v,
          isCurrent: false,
        }));

        const rolled = updated.find((v) => v.id === selectedVersion.id);
        if (!rolled) return updated;

        // tạo snapshot mới (version lớn hơn hiện tại)
        const maxVersion = Math.max(...updated.map((v) => v.version));
        const newSnapshot: PolicyVersion = {
          ...rolled,
          id: `v${maxVersion + 1}`,
          version: maxVersion + 1,
          createdAt: timestamp,
          createdBy: "admin", // thực tế lấy từ currentUser
          description: `Snapshot mới sau rollback từ v${rolled.version}`,
          isCurrent: true,
          // risk của snapshot mới coi như low (vì là trạng thái đã chạy qua dry-run)
          riskLevel: "low",
        };

        return [...updated, newSnapshot];
      });

      setDryRunResult({ status: "idle" });
      setIsApplying(false);
      alert(
        `Đã rollback thành công về cấu hình của version v${selectedVersion.version}.\n` +
          "Hệ thống đã tạo snapshot mới và ghi nhận audit (demo)."
      );
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-bk-blue" />
          <h1 className="text-2xl font-semibold tracking-tight text-bk-blue">
            Rollback quyền (UC-N2)
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Admin khôi phục quyền truy cập về một phiên bản cũ khi cần sửa lỗi hoặc
          quay lại cấu hình ổn định, có hỗ trợ dry-run để đánh giá rủi ro trước
          khi áp dụng.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr),minmax(0,1.2fr)] gap-4">
        {/* Cột trái: danh sách version */}
        <Card className="border border-bk-blue/20 bg-white/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Danh sách phiên bản quyền
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Mỗi lần thay đổi role/permission (UC-N1), hệ thống phát hành một
                version mới và ghi lại metadata để có thể rollback. 
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {versions.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Không có phiên bản cũ. Không thể thực hiện rollback.
              </p>
            )}

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {versions
                .slice()
                .sort((a, b) => b.version - a.version)
                .map((v) => {
                  const selected = v.id === selectedVersionId;
                  const riskColor =
                    v.riskLevel === "low"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : v.riskLevel === "medium"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200";

                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVersionId(v.id)}
                      className={[
                        "w-full text-left rounded-md border px-3 py-2 text-xs transition-colors",
                        selected
                          ? "border-bk-blue bg-bk-blue-soft/60"
                          : "border-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            Version v{v.version}
                          </span>
                          {v.isCurrent && (
                            <Badge
                              variant="outline"
                              className="border-emerald-400 text-emerald-700 bg-emerald-50 text-[10px]"
                            >
                              Hiện tại
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {v.createdAt}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-[11px] text-slate-700">
                            {v.description}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Tạo bởi <span className="font-medium">{v.createdBy}</span> ·{" "}
                            {v.affectedRoles} role · ~{v.affectedUsersApprox} user
                          </p>
                        </div>
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border",
                            riskColor,
                          ].join(" ")}
                        >
                          {v.riskLevel === "low"
                            ? "Rủi ro thấp"
                            : v.riskLevel === "medium"
                            ? "Rủi ro trung bình"
                            : "Rủi ro cao"}
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Cột phải: chi tiết + dry-run + rollback */}
        <Card className="border border-bk-blue/20 bg-white/80">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Chi tiết & thao tác rollback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Info hiện tại */}
            <div className="flex items-start gap-2 text-[11px] bg-bk-blue-soft/60 border border-bk-blue/20 rounded-md px-3 py-2">
              <Info className="h-3.5 w-3.5 mt-0.5 text-bk-blue" />
              <div>
                <p className="font-medium text-bk-blue">
                  Trạng thái hiện tại của hệ thống
                </p>
                {currentVersion ? (
                  <p className="text-slate-700">
                    Đang sử dụng <span className="font-semibold">
                      version v{currentVersion.version}
                    </span>{" "}
                    (tạo bởi{" "}
                    <span className="font-semibold">
                      {currentVersion.createdBy}
                    </span>{" "}
                    lúc {currentVersion.createdAt}).
                  </p>
                ) : (
                  <p className="text-slate-700">
                    Chưa xác định version hiện tại (demo).
                  </p>
                )}
              </div>
            </div>

            {/* Chi tiết version được chọn */}
            <div className="space-y-1">
              <p className="font-medium">Phiên bản được chọn</p>
              {!selectedVersion ? (
                <p className="text-[11px] text-slate-500">
                  Vui lòng chọn một version ở danh sách bên trái để xem chi tiết.
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="text-[11px]">
                    Đang chọn{" "}
                    <span className="font-semibold">
                      version v{selectedVersion.version}
                    </span>{" "}
                    (tạo bởi{" "}
                    <span className="font-semibold">
                      {selectedVersion.createdBy}
                    </span>{" "}
                    lúc {selectedVersion.createdAt}).
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Mô tả: {selectedVersion.description}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Ảnh hưởng dự kiến:{" "}
                    <span className="font-semibold">
                      {selectedVersion.affectedRoles} role
                    </span>{" "}
                    · khoảng{" "}
                    <span className="font-semibold">
                      {selectedVersion.affectedUsersApprox} user
                    </span>
                    .
                  </p>
                </div>
              )}
            </div>

            {/* Dry-run */}
            <div className="space-y-1">
              <p className="font-medium flex items-center gap-1">
                <PlayCircle className="h-3 w-3 text-bk-blue" />
                Dry-run & đánh giá rủi ro (không ghi vào DB)
              </p>
              <p className="text-[11px] text-muted-foreground mb-1">
                Theo activity UC-N2, nếu phát hiện rủi ro tương thích, hệ thống
                sẽ chạy dry-run trên môi trường tách biệt, báo cáo ảnh hưởng và
                yêu cầu xác nhận lần cuối.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={handleDryRun}
                  disabled={!selectedVersion}
                >
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Chạy dry-run
                </Button>
              </div>

              {/* Kết quả dry-run */}
              {dryRunResult.status !== "idle" && (
                <div
                  className={[
                    "mt-2 rounded-md border px-3 py-2 text-[11px] space-y-1",
                    dryRunResult.status === "ok"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-amber-200 bg-amber-50 text-amber-800",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-1">
                    {dryRunResult.status === "ok" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )}
                    <span className="font-medium">
                      {dryRunResult.status === "ok"
                        ? "Dry-run thành công"
                        : "Dry-run có rủi ro"}
                    </span>
                  </div>
                  <p>{dryRunResult.message}</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {dryRunResult.details.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Rollback */}
            <div className="space-y-1 pt-2 border-t border-dashed border-slate-200">
              <p className="font-medium flex items-center gap-1">
                <RotateCcw className="h-3 w-3 text-bk-blue" />
                Thực hiện rollback
              </p>
              <p className="text-[11px] text-muted-foreground mb-1">
                Khi rollback, hệ thống áp dụng cấu hình quyền của phiên bản được
                chọn, tạo snapshot mới và ghi audit đầy đủ. 
              </p>
              <Button
                size="sm"
                className="w-full"
                onClick={handleApplyRollback}
                disabled={!canRollback || isApplying}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                {isApplying
                  ? "Đang áp dụng rollback..."
                  : selectedVersion && selectedVersion.isCurrent
                  ? "Đây là version hiện tại"
                  : "Rollback về phiên bản đã chọn & tạo snapshot mới"}
              </Button>
              {!canRollback && (
                <p className="text-[10px] text-slate-500 mt-1">
                  * Hãy chọn một phiên bản khác version hiện tại để rollback.
                </p>
              )}
            </div>

            {/* Ghi chú lỗi/exception */}
            <div className="pt-2 border-t border-dashed border-slate-200 text-[11px] text-slate-500 space-y-1">
              <p className="font-medium flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                Lưu ý & exception flow
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>
                  Nếu không có phiên bản cũ, hệ thống thông báo và dừng thao tác
                  (không rollback).
                </li>
                <li>
                  Nếu áp dụng rollback thất bại, hệ thống phải tự động rollback
                  về trạng thái trước khi chạy UC-N2 và ghi audit.
                </li>
                <li>
                  Nếu Admin không có quyền quản trị RBAC, thao tác bị chặn và ghi
                  log theo UC-X1, UC-X7 (kiểm tra quyền nằm ở backend). 
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
