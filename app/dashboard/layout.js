import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}