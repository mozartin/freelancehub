// src/auth/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { loginRequest, logoutRequest, registerRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // For now just false — can later implement auto-login from localStorage
  const loading = false;

  const login = async (email, password) => {
    const data = await loginRequest(email, password);

    // Check what actually comes back
    console.log("LOGIN RESPONSE:", data);

    localStorage.setItem("auth_token", data.token);
    setUser(data.user);

    return data;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      console.warn("Logout API error, ignoring:", e);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  };

  const register = async (payload) => {
    try {
      const data = await registerRequest(payload);
      return data;
    } catch (error) {
      const response = error?.response;
      const validationErrors = response?.data?.errors;
      const message =
        response?.data?.message || error.message || "Registration failed";

      const wrapped = new Error(message);

      if (validationErrors) {
        wrapped.validation = validationErrors;
      }

      throw wrapped;
    }
  };

  // 🔥 If token exists — consider user authenticated
  const isAuthenticated = !!localStorage.getItem("auth_token");

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
