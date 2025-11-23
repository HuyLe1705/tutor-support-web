"use client"; // Cần useAuth nên phải là Client Component
import { Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header({ title }) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-700">Tutor</h2>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm cursor-pointer hover:bg-gray-100 p-2 rounded">
           <Globe size={16}/> <span>VN</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.avatar || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name || 'User Name'}</span>
        </div>
      </div>
    </header>
  );
}