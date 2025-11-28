import { SessionsProvider } from "@/context/SessionsContext";

export default function StudentLayout({ children }) {
  return (
    <SessionsProvider>
      {children}
    </SessionsProvider>
  );
}
