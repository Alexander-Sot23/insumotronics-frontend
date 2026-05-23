import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();
const ADMIN_VIEW_KEY = 'adminViewMode';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminViewMode, setAdminViewMode] = useState(() => {
    return localStorage.getItem(ADMIN_VIEW_KEY) || 'admin';
  });

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
  const isAdminView = isAdmin && adminViewMode === 'admin';
  const effectiveRole = isAdminView ? 'ADMIN' : (user?.role?.toUpperCase() === 'ADMIN' ? 'STUDENT' : user?.role);

  useEffect(() => {
    const verifySession = async () => {
      // Si el usuario ya está en la página de login, no tiene sentido verificar la sesión
      if (window.location.pathname === '/login') {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/api/auth/me');
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.warn('Sesión inválida o expirada.');
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData?.role?.toUpperCase() !== 'ADMIN') {
      setAdminViewMode('student');
      localStorage.setItem(ADMIN_VIEW_KEY, 'student');
    }
  };

  const toggleAdminViewMode = () => {
    if (!isAdmin) return;

    setAdminViewMode((currentMode) => {
      const nextMode = currentMode === 'admin' ? 'student' : 'admin';
      localStorage.setItem(ADMIN_VIEW_KEY, nextMode);
      return nextMode;
    });
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/logout');
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem(ADMIN_VIEW_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        isAdmin,
        isAdminView,
        adminViewMode,
        effectiveRole,
        toggleAdminViewMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
