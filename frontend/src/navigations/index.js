import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthNavigator";
import AppStack from "./AppNavigator";
import SplashScreen from "../screens/AuthScreens/SplashScreen";
import { useAuthContext } from "../context/AuthContext";


const index = () => {

  const { token,isLoading } = useAuthContext()
  console.log('Token ', token)

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>

      {token !== null ? <AppStack /> : <AuthStack />}

    </NavigationContainer>
  );
};

export default index;
