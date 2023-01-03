import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext'
import React from 'react';
import APIService from '../utils/ApiService'

export const AuthProvider = (props) => {
    const { children } = props;
    const [userInfo,setUserInfo] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isAgent,setIsAgent] = useState(false);

    useEffect(() => {
        async function getToken() {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                setToken(token)
            }
        }

        async function getUserData(){
            const userData = await AsyncStorage.getItem('userInfo');

            if (userData){
                setUserInfo(JSON.parse(userData))
            }
        }
        getToken().then(()=>getUserData())
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
    }, [token])

    useEffect(()=>{
        async function setUserData(){
            if(userInfo){
                await AsyncStorage.setItem('userInfo',JSON.stringify(userInfo))
            }
        }
        setUserData(userInfo)
    },[userInfo])


    const login = async (username, password) => {
        const res = await APIService.authenticate(username, password)
        setIsLoading(false)
        return res;
    }

    // const testLogin = () => {
    //     setIsLoading(true)
    //     setToken('ivantom')
    //     AsyncStorage.setItem('token','ivantom');
    //     setIsLoading(false)
    // }

    // const lestLogout = () => {
    //     setIsLoading(true)
    //     setToken(null)
    //     AsyncStorage.removeItem('token')
    //     setIsLoading(false)
    // }

    const isLoggedIn = async () => {
        try{
            setIsLoading(true)
            let userToken = await AsyncStorage.getItem('token')
            setToken(userToken)
            setIsLoading(false)
        }
        catch(e){
            console.log(`isLogged in error ${e}`)
        }
    }

    useEffect(()=>{
        isLoggedIn()
    },[])

    const logout = async () => {
        if (token) {
            await AsyncStorage.removeItem('token')
            await APIService.logout(token)
            setToken(null);
            setIsLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{ isAgent,setIsAgent,userInfo: userInfo,setUserInfo, token, setToken, login, logout, isLoading, setIsLoading }}>{children}</AuthContext.Provider>
    )


}
