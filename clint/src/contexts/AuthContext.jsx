// filepath: c:\Users\gabriyel\OneDrive\Desktop\food-delivery-app\src\contexts\AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken); // ✅ Store token properly
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken'); // ✅ Remove token properly
    delete axios.defaults.headers.common["Authorization"]; // ✅ Ensure cleanup
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
