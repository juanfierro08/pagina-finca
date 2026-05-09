import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const isAdmin = userData.email === 'juanfierro0821@gmail.com' || userData.email === 'admin@alojate.com';
    const mockUser = {
      id: isAdmin ? 'admin1' : `u_${Date.now()}`,
      role: isAdmin ? 'Administrador' : 'Usuario',
      currentMode: isAdmin ? 'Administrador' : 'Huesped', // Default mode
      ...userData
    };
    setUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
  };

  const toggleMode = () => {
    if (user && user.role !== 'Administrador') {
      const newMode = user.currentMode === 'Huesped' ? 'Propietario' : 'Huesped';
      const updatedUser = { ...user, currentMode: newMode };
      setUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, toggleMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
