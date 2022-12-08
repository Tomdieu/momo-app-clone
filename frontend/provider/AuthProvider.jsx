import React, { useEffect, useState} from "react";
import {AuthContext} from '../context/AuthContext/';

export const AuthProvider = ({ children }) => {
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [user,setUser]= useState({});
    const [token,setToken] = useState();

    useEffect(()=>{

    },[]);


    const login = (username,password) =>{

    }

    const logout = (token) =>{

    }


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout
      }}
    >
    {children}
    </AuthContext.Provider>
  );
};
