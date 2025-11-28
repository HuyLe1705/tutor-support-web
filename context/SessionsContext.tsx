"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { mockSessions, Session } from "@/data/sessions_mentee";

// Kiểu dữ liệu của context
type SessionsContextType = {
  sessionList: Session[];
  setSessionList: Dispatch<SetStateAction<Session[]>>;
};

// Tạo context
const SessionsContext = createContext<SessionsContextType | undefined>(
  undefined
);

// Provider bọc quanh các page cần dùng sessionList
export function SessionsProvider({ children }: { children: React.ReactNode }) {
  // 🔹 Đây là "DB giả lập" cho toàn BKPortal trong 1 lần chạy app
  const [sessionList, setSessionList] = useState<Session[]>(mockSessions);

  const value = useMemo(
    () => ({
      sessionList,
      setSessionList,
    }),
    [sessionList]
  );

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}

// Hook tiện dùng trong các page / component
export function useSessions(): SessionsContextType {
  const ctx = useContext(SessionsContext);
  if (!ctx) {
    throw new Error(
      "useSessions phải được dùng bên trong <SessionsProvider> (vd: bọc ở layout BKPortal)."
    );
  }
  return ctx;
}
