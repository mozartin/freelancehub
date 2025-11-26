// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/me") 
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });

    const { user, token } = res.data; 

    localStorage.setItem("auth_token", token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
