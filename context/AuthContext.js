"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { USERS } from '@/data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Giả lập: Khôi phục phiên đăng nhập từ localStorage khi F5
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    // Tìm user trong danh sách mockData
    const foundUser = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      // Chuyển hướng dựa trên role (để demo flow mượt hơn)
      router.push('/dashboard'); 
      return { success: true };
    } else {
      return { success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}