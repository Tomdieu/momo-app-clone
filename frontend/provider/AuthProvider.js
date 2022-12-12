import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext/";
import * as SecureStore from "expo-secure-store";
import APIService from "../utils/ApiService";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);

  useEffect(async () => {
    try {
      const tkn = await SecureStore.getItemAsync("token");
      if (tkn) {
        setToken(tkn);
        setIsAuthenticated(true);
        // AsyncStorageStatic.setItem('token',)
      }
    } catch (e) {}
  }, []);

  useEffect(async () => {
    const res = await APIService.getProfile(token);
    console.log(res);
  }, [token]);

  /**
   *
   * This functions helps to authenticate a user
   *
   * @param {String} username
   * @param {String} password
   */
  const login = async (username, password) => {
    const res = await APIService.login(username, password);


    // await SecureStore.setItemAsync('token','1234');
    console.log(res);
  };

  /**
   *
   * This functions logout an authenticated user
   */
  const logout = async () => {
    if (isAuthenticated && token) {
      await APIService.logout(token);
      setIsAuthenticated(false);
      setUser({});
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
