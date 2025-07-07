import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const baseUrl =
  import.meta.env.MODE === "development" ? "http://localhost:5003" : "";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(baseUrl + "/user/verifytoken",{
      method:"get",
      headers:{token:token}
    }).then(res=>res.json( 
      
    )) .then(result=>{
      if (result.success) {
        setIsLoggedIn(true);
        setUser(result.data);

      } else {
        setIsLoggedIn(false);
        setUser(null);
       
      }   
     })
    

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token); 

    setIsLoggedIn(true);
    setUser(userData.data); 
    navigate("/profile");
  };
  const logout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("userData"); 
    setIsLoggedIn(false); 
    setUser(null); 
    navigate("/login"); 
  };

  const register = (userData) => {
    
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
