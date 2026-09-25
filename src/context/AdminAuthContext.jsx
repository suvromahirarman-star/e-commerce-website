import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);
const STORAGE_KEY = 'aura_admin_session';

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const isAuthenticated = Boolean(adminUser);

  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync admin session to localStorage:', e);
    }
  }, [adminUser]);

  /**
   * Simulated Admin Login (Structured for future JWT authentication)
   */
  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Simulated check (Any valid looking credentials or demo 'admin@aurastudio.com' / 'admin123')
    if (email && password && password.length >= 4) {
      const user = {
        id: 'usr_admin_01',
        name: 'Mahir Arman',
        email: email.trim(),
        role: 'Super Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        token: `mock_jwt_token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      setAdminUser(user);
      return { success: true, user };
    }

    return {
      success: false,
      error: 'Invalid email or password (minimum 4 characters required).',
    };
  };

  /**
   * Admin Logout
   */
  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
