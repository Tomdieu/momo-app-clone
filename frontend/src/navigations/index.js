import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import SplashScreen from "../screens/AuthScreens/SplashScreen";
import { useAuthContext } from "../context/AuthContext";

const Stack = createStackNavigator();

const index = () => {

  const { token } = useAuthContext()
  console.log(token)



  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AppScreen" component={AppNavigator} />
        <Stack.Screen name="AuthScreen" component={AuthNavigator} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default index;
