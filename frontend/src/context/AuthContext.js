import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import apiService from "../services/apiService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser({ token, username: localStorage.getItem("username") });
        apiService.setAuthToken(token);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      }
    }
    setLoading(false);
  }, []);

  const login = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setUser({ token, username });
    apiService.setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    apiService.setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
