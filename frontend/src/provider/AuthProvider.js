import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext'
import React from 'react';
import APIService from '../utils/ApiService'

export const AuthProvider = (props) => {
    const { children } = props;
    const [token, setToken] = useState('')

    useEffect(() => {
        async function getToken() {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                setToken(token)
            }
        }
        getToken();
    }, [])

    useEffect(() => {
        async function setToken(token) {
            if (token) {
                await AsyncStorage.setItem('token', token)
            }
        }
        if(token){
            setToken(token)
        }
    }, [token])


    const login = async (username, password) => {
        const res = await APIService.authenticate(username, password)
        return res;
    }

    const logout = async () => {
        if (token) {
            await AsyncStorage.removeItem('token')
            await APIService.logout(token)
        }
    }

    return (
        <AuthContext.Provider value={{ token, setToken, login, logout }}>{children}</AuthContext.Provider>
    )


}
