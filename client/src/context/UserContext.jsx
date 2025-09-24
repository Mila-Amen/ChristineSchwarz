import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const baseUrl =
    import.meta.env.MODE === "development" ? "http://localhost:5003" : "";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/user/verifytoken`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // standard header
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((result) => {
        if (result.success) {
          setIsLoggedIn(true);
          setUser(result.data);
        } else {
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setUser(userData.data);
    navigate("/profile");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const register = (userData) => {
    // your registration logic here
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        login,
        logout,
        register,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
