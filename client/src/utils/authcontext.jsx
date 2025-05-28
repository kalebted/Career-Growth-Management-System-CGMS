// src/utils/authcontext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ no curly braces needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const decoded = jwtDecode(token);
        const parsedUser = JSON.parse(userData);

        // ✅ Always trust JWT for id & role
        setUser({
          id: decoded.id,
          role: decoded.role,
          ...parsedUser, // profile info: name, email, picture, etc.
        });
      } catch (err) {
        console.error("Error restoring session", err);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));

      setUser({
        id: decoded.id,
        role: decoded.role, // ✅ Always from JWT
        ...userData,
      });
    } catch (err) {
      console.error("Login error", err);
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    if (navigate) navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
