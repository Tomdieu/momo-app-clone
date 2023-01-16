import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext'
import React from 'react';
import APIService from '../utils/ApiService'

import { useLanguageContext } from '../context/LangContext';

import WebSocket from 'ws';

export const AuthProvider = (props) => {
    const { children } = props;
    const [userInfo, setUserInfo] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isAgent, setIsAgent] = useState(false);

    const { setLocale } = useLanguageContext()

    // const ws = useRef(null);

    // useEffect(() => {
    //     if (userInfo) {

    //         const ws = new WebSocket(`${APIService.webSocketUrl}/ws/notifications/${userInfo.user.id}`);

    //         ws.on('open', function open() {
    //             console.log("connection established")
    //         });

    //         ws.on('message', function message(data) {
    //             console.log('received: %s', data);
    //             setNotificationCount(notificationCount + 1)
    //         });

    //     }


    // }, [userInfo])

    useEffect(() => {
        async function getToken() {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                setToken(token)
            }
        }

        async function getUserData() {
            const userData = await AsyncStorage.getItem('userInfo');

            if (userData) {
                setUserInfo(JSON.parse(userData))
            }
        }
        getToken().then(() => {
            getUserData().then(()=>{});
        })
    }, [])

    useEffect(() => {
        async function setUserToken(token) {
            if (token) {
                await AsyncStorage.setItem('token', token)
            }
        }
        if (token) {
            setUserToken(token)
        }
        // else if(token === null){
        //     AsyncStorage.removeItem('token').then(()=>{
                
        //         AsyncStorage.removeItem("userInfo").then(()=>{
        //             setUserInfo(null)
        //         })
        //     })
        // }
    }, [token])

    useEffect(() => {
        async function setUserData() {
            if (userInfo) {
                await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
                if(userInfo){
                    // console.log("user info : ",userInfo);
                    setLocale(userInfo?.lang?.toLocaleLowerCase() || 'en')
                }
            }
        }
        setUserData(userInfo)
    }, [userInfo])


    const login = async (username, password) => {
        const res = await APIService.authenticate(username, password)
        setIsLoading(false)
        return res;
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true)
            let userToken = await AsyncStorage.getItem('token')
            setToken(userToken)
            setIsLoading(false)
        }
        catch (e) {
            console.log(`isLogged in error ${e}`)
        }
    }

    useEffect(() => {
        isLoggedIn()
    }, [])

    const logout = async () => {
        if (token) {
            await AsyncStorage.removeItem('token')
            setToken(null);
            setIsLoading(false)
            // APIService.logout(token).then(res => { }).catch(err => console.log(err)).finally(() => {
            // })
        }
        await AsyncStorage.clear();
        setToken(null);
        setUserInfo(null)
    }

    return (
        <AuthContext.Provider value={{ isAgent, setIsAgent, userInfo: userInfo, setUserInfo, token, setToken, login, logout, isLoading, setIsLoading }}>{children}</AuthContext.Provider>
    )


}
