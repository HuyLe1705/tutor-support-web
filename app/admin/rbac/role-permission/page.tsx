// app/admin/rbac/role-permission/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ShieldCheck, AlertTriangle, Save, Undo2, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type RoleSource = "SSO" | "Local";

type Role = {
  id: string;
  code: string;
  name: string;
  source: RoleSource;
};

type Permission = {
  id: string;
  code: string;
  name: string;
  group: "Program" | "Session" | "Report" | "RBAC";
  description: string;
};

type Strategy = "allow-overrides" | "deny-overrides";

type RolePolicy = {
  roleId: string;
  permissionIds: string[];
  strategy: Strategy;
  version: number;
  updatedAt: string;
  updatedBy: string;
};

const ROLES: Role[] = [
  {
    id: "student",
    code: "STUDENT",
    name: "Student (SV)",
    source: "SSO",
  },
  {
    id: "tutor",
    code: "TUTOR",
    name: "Tutor",
    source: "SSO",
  },
  {
    id: "coordinator",
    code: "COORDINATOR",
    name: "Coordinator khoa",
    source: "SSO",
  },
  {
    id: "admin",
    code: "ADMIN",
    name: "Admin hệ thống",
    source: "Local",
  },
];

const PERMISSIONS: Permission[] = [
  // Program
  {
    id: "prog.view",
    code: "PROG_VIEW",
    name: "Xem danh sách chương trình",
    group: "Program",
    description: "Cho phép xem danh sách & chi tiết cấu hình chương trình.",
  },
  {
    id: "prog.manage",
    code: "PROG_MANAGE",
    name: "Tạo / sửa chương trình",
    group: "Program",
    description: "Cho phép tạo mới, chỉnh sửa, tạm dừng chương trình.",
  },

  // Session
  {
    id: "session.view",
    code: "SESSION_VIEW",
    name: "Xem lịch & phiên",
    group: "Session",
    description: "Truy cập danh sách buổi, phiên tư vấn, slot lịch.",
  },
  {
    id: "session.manage",
    code: "SESSION_MANAGE",
    name: "Quản lý phiên & lịch",
    group: "Session",
    description: "Đổi lịch, huỷ phiên, khóa ghi nhận sau hạn.",
  },

  // Report
  {
    id: "report.export",
    code: "REPORT_EXPORT",
    name: "Xuất báo cáo (CSV/PDF)",
    group: "Report",
    description: "Cho phép dùng màn export tổng quan, tiến độ.",
  },
  {
    id: "report.anonymize",
    code: "REPORT_ANON",
    name: "Ẩn danh hoá báo cáo",
    group: "Report",
    description: "Cho phép bật/tắt ẩn danh dữ liệu khi xuất.",
  },

  // RBAC
  {
    id: "rbac.mapping",
    code: "RBAC_MAPPING",
    name: "Ánh xạ Role - Permission",
    group: "RBAC",
    description: "Quyền sử dụng màn hình UC-N1 để chỉnh role-permission.",
  },
  {
    id: "rbac.rollback",
    code: "RBAC_ROLLBACK",
    name: "Rollback quyền",
    group: "RBAC",
    description: "Quyền khôi phục policy về version trước (UC-N2).",
  },
];

// mock policy ban đầu
const INITIAL_POLICIES: RolePolicy[] = [
  {
    roleId: "student",
    permissionIds: ["prog.view", "session.view"],
    strategy: "deny-overrides",
    version: 3,
    updatedAt: "2025-11-01 10:15",
    updatedBy: "admin",
  },
  {
    roleId: "tutor",
    permissionIds: [
      "prog.view",
      "session.view",
      "session.manage",
      "report.export",
    ],
    strategy: "allow-overrides",
    version: 2,
    updatedAt: "2025-11-10 09:30",
    updatedBy: "admin",
  },
  {
    roleId: "coordinator",
    permissionIds: [
      "prog.view",
      "session.view",
      "session.manage",
      "report.export",
      "report.anonymize",
    ],
    strategy: "allow-overrides",
    version: 4,
    updatedAt: "2025-11-18 08:00",
    updatedBy: "admin",
  },
  {
    roleId: "admin",
    permissionIds: PERMISSIONS.map((p) => p.id),
    strategy: "allow-overrides",
    version: 5,
    updatedAt: "2025-11-20 14:22",
    updatedBy: "system",
  },
];

export default function RolePermissionMappingPage() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("admin");
  const [policies, setPolicies] = useState<RolePolicy[]>(INITIAL_POLICIES);
  const [roleSearch, setRoleSearch] = useState("");
  const [permSearch, setPermSearch] = useState("");

  const currentRole = useMemo(
    () => ROLES.find((r) => r.id === selectedRoleId) ?? ROLES[0],
    [selectedRoleId]
  );

  const currentPolicy = useMemo(() => {
    let policy = policies.find((p) => p.roleId === currentRole.id);
    if (!policy) {
      policy = {
        roleId: currentRole.id,
        permissionIds: [],
        strategy: "deny-overrides",
        version: 1,
        updatedAt: "Chưa lưu",
        updatedBy: "—",
      };
    }
    return policy;
  }, [currentRole, policies]);

  const filteredRoles = useMemo(() => {
    const q = roleSearch.toLowerCase().trim();
    if (!q) return ROLES;
    return ROLES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q)
    );
  }, [roleSearch]);

  const filteredPermissions = useMemo(() => {
    const q = permSearch.toLowerCase().trim();
    if (!q) return PERMISSIONS;
    return PERMISSIONS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
    );
  }, [permSearch]);

  const handleTogglePermission = (permId: string) => {
    const hasPerm = currentPolicy.permissionIds.includes(permId);
    const nextPerms = hasPerm
      ? currentPolicy.permissionIds.filter((id) => id !== permId)
      : [...currentPolicy.permissionIds, permId];

    setPolicies((prev) => {
      const existIndex = prev.findIndex((p) => p.roleId === currentRole.id);
      const base: RolePolicy =
        existIndex >= 0 ? prev[existIndex] : currentPolicy;

      const updated: RolePolicy = {
        ...base,
        permissionIds: nextPerms,
        // mỗi lần chỉnh mình cho tăng version tạm (demo)
        version: base.version + 1,
        updatedAt: "Chưa lưu",
        updatedBy: "Nháp (local)",
      };

      if (existIndex >= 0) {
        const clone = [...prev];
        clone[existIndex] = updated;
        return clone;
      }
      return [...prev, updated];
    });
  };

  const handleStrategyChange = (strategy: Strategy) => {
    setPolicies((prev) => {
      const existIndex = prev.findIndex((p) => p.roleId === currentRole.id);
      const base: RolePolicy =
        existIndex >= 0 ? prev[existIndex] : currentPolicy;

      const updated: RolePolicy = {
        ...base,
        strategy,
        version: base.version + 1,
        updatedAt: "Chưa lưu",
        updatedBy: "Nháp (local)",
      };

      if (existIndex >= 0) {
        const clone = [...prev];
        clone[existIndex] = updated;
        return clone;
      }
      return [...prev, updated];
    });
  };

  // Demo: giả lập detect conflict (ở thực tế bạn sẽ check từ backend)
  const conflicts = useMemo(() => {
    const result: string[] = [];

    // ví dụ: nếu role có cả report.export & report.anonymize thì gợi ý check chiến lược
    if (
      currentPolicy.permissionIds.includes("report.export") &&
      currentPolicy.permissionIds.includes("report.anonymize") &&
      currentPolicy.strategy === "deny-overrides"
    ) {
      result.push(
        "Role vừa có quyền xuất báo cáo, vừa có quyền ẩn danh hoá, nhưng strategy đang là deny-overrides. Hãy kiểm tra xem có cần allow-overrides cho report không."
      );
    }

    // demo thêm cảnh báo nếu role có RBAC_MAPPING nhưng không phải admin
    if (
      currentPolicy.permissionIds.includes("rbac.mapping") &&
      currentRole.id !== "admin"
    ) {
      result.push(
        "Quyền 'Ánh xạ Role - Permission' thường chỉ nên cấp cho Admin. Hãy cân nhắc lại."
      );
    }

    return result;
  }, [currentPolicy, currentRole]);

  const handleSave = () => {
    // TODO: gọi API POST/PUT /api/admin/rbac/role-permission
    console.log("Saving policy for role", currentRole.id, currentPolicy);
    alert(
      `Đã giả lập lưu cấu hình role-permission cho ${currentRole.name}.\n` +
        "Sau này bạn nối API để persist vào DB & phát hành version policy."
    );
  };

  const handleRollbackPreview = () => {
    // Liên quan UC-N2: bạn có thể điều hướng sang trang rollback hoặc mở modal
    alert(
      "Demo: UC-N2 Rollback quyền.\nThực tế sẽ hiển thị danh sách version trước đó và cho phép chọn để khôi phục."
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-bk-blue" />
          <h1 className="text-2xl font-semibold tracking-tight text-bk-blue">
            Ánh xạ Role - Permission (UC-N1)
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Admin cấu hình ánh xạ role → permission theo mô hình RBAC: chọn role,
          gán quyền, áp dụng chiến lược allow-overrides / deny-overrides, lưu
          version và ghi nhật ký thay đổi.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px,minmax(0,1.6fr),minmax(0,1.1fr)] gap-4">
        {/* Cột 1: Danh sách role */}
        <Card className="border border-bk-blue/20 bg-white/80">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Role hiện có
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                className="pl-7 pr-2 h-8 w-full rounded-md border text-xs bg-white"
                placeholder="Tìm theo mã hoặc tên role..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
              />
            </div>

            <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
              {filteredRoles.map((role) => {
                const active = role.id === currentRole.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={[
                      "w-full flex items-center justify-between gap-2 rounded-md px-2 py-1 text-xs text-left",
                      active
                        ? "bg-bk-blue text-white"
                        : "hover:bg-slate-100 text-slate-700",
                    ].join(" ")}
                  >
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div
                        className={
                          active
                            ? "text-[10px] text-white/80"
                            : "text-[10px] text-slate-500"
                        }
                      >
                        {role.code}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        active
                          ? "border-white/50 text-white/90 text-[10px]"
                          : "border-slate-300 text-slate-600 text-[10px]"
                      }
                    >
                      {role.source === "SSO" ? "SSO" : "Local"}
                    </Badge>
                  </button>
                );
              })}

              {filteredRoles.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Không tìm thấy role phù hợp.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cột 2: Danh sách permission cho role */}
        <Card className="border border-bk-blue/20 bg-white/80">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold">
                Permission gán cho role:{" "}
                <span className="font-semibold text-bk-blue">
                  {currentRole.name}
                </span>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Chọn các quyền phù hợp cho role này. Hệ thống sẽ kiểm tra trùng
                / xung đột và áp dụng chiến lược hợp nhất quyền.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative mb-2">
              <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                className="pl-7 pr-2 h-8 w-full rounded-md border text-xs bg-white"
                placeholder="Tìm permission theo mã hoặc tên..."
                value={permSearch}
                onChange={(e) => setPermSearch(e.target.value)}
              />
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {(["Program", "Session", "Report", "RBAC"] as const).map(
                (group) => {
                  const permsInGroup = filteredPermissions.filter(
                    (p) => p.group === group
                  );
                  if (permsInGroup.length === 0) return null;

                  return (
                    <div key={group} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          {group === "Program"
                            ? "Program"
                            : group === "Session"
                            ? "Session & Lịch"
                            : group === "Report"
                            ? "Báo cáo"
                            : "RBAC & Bảo mật"}
                        </h3>
                        <span className="text-[10px] text-slate-400">
                          {
                            currentPolicy.permissionIds.filter((id) =>
                              permsInGroup.some((p) => p.id === id)
                            ).length
                          }{" "}
                          / {permsInGroup.length} quyền
                        </span>
                      </div>

                      <div className="space-y-1">
                        {permsInGroup.map((perm) => {
                          const checked =
                            currentPolicy.permissionIds.includes(perm.id);
                          return (
                            <label
                              key={perm.id}
                              className="flex items-start gap-2 rounded-md px-2 py-1 hover:bg-slate-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="mt-0.5 h-3 w-3"
                                checked={checked}
                                onChange={() =>
                                  handleTogglePermission(perm.id)
                                }
                              />
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-slate-800">
                                  {perm.name}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {perm.code} · {perm.description}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cột 3: Cấu hình strategy + conflict + save */}
        <Card className="border border-bk-blue/20 bg-white/80">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Cấu hình chiến lược & phiên bản policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Strategy */}
            <div className="space-y-1">
              <p className="font-medium">Chiến lược hợp nhất quyền</p>
              <p className="text-[11px] text-muted-foreground mb-1">
                Theo UC-N1, hệ thống hỗ trợ allow-overrides hoặc deny-overrides
                khi phát hiện xung đột quyền.
              </p>
              <div className="flex flex-col gap-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="strategy"
                    className="mt-0.5"
                    checked={currentPolicy.strategy === "allow-overrides"}
                    onChange={() =>
                      handleStrategyChange("allow-overrides")
                    }
                  />
                  <div>
                    <div className="font-medium">allow-overrides</div>
                    <div className="text-[11px] text-slate-500">
                      Quyền cho phép (allow) của role có thể override deny từ
                      nguồn khác nếu có xung đột.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="strategy"
                    className="mt-0.5"
                    checked={currentPolicy.strategy === "deny-overrides"}
                    onChange={() =>
                      handleStrategyChange("deny-overrides")
                    }
                  />
                  <div>
                    <div className="font-medium">deny-overrides</div>
                    <div className="text-[11px] text-slate-500">
                      Nếu có xung đột, deny sẽ thắng; thường dùng cho các
                      quyền nhạy cảm.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <p className="font-medium">Tóm tắt cho role hiện tại</p>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                <li>
                  Số permission đang gán:{" "}
                  <span className="font-semibold">
                    {currentPolicy.permissionIds.length}
                  </span>
                </li>
                <li>
                  Version hiện tại:{" "}
                  <span className="font-semibold">
                    v{currentPolicy.version}
                  </span>
                </li>
                <li>
                  Cập nhật lần cuối:{" "}
                  <span className="font-semibold">
                    {currentPolicy.updatedAt}
                  </span>{" "}
                  bởi{" "}
                  <span className="font-semibold">
                    {currentPolicy.updatedBy}
                  </span>
                </li>
              </ul>
            </div>

            {/* Conflicts */}
            <div className="space-y-1">
              <p className="font-medium flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                Trùng / xung đột (gợi ý)
              </p>
              {conflicts.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  Không phát hiện cảnh báo nào trên bản nháp hiện tại.
                </p>
              ) : (
                <ul className="list-disc list-inside text-[11px] text-amber-700 space-y-0.5">
                  {conflicts.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Hành động */}
            <div className="flex flex-col gap-2 pt-2">
              <Button size="sm" className="w-full" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Lưu cấu hình & phát hành version mới
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={handleRollbackPreview}
              >
                <Undo2 className="h-4 w-4 mr-1" />
                Xem / rollback về version trước (UC-N2)
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Sau khi lưu, hệ thống sẽ ghi audit (ai, khi nào, thay đổi gì) và
                gửi thông báo tới các hệ tích hợp nếu cần, đúng với UC-N1. 
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
