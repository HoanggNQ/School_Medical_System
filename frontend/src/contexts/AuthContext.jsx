import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedIsFirstLogin = localStorage.getItem('isFirstLogin');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedIsFirstLogin) {
      setIsFirstLogin(JSON.parse(savedIsFirstLogin));
    }
    setLoading(false);
  }, []);

  const login = (userData, token, firstLogin = false) => {
    setUser(userData);
    setToken(token);
    setIsFirstLogin(firstLogin);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('isFirstLogin', JSON.stringify(firstLogin));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    window.location.href = '/auth';
  };



  const value = {
    user,
    token,
    isFirstLogin,
    login,
    logout,
   
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
