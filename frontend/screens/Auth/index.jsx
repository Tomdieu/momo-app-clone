import { View, Text } from 'react-native'
import React from 'react'

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from './Login';
import Register from './Register';

const Stack = createNativeStackNavigator();

const AuthScreenStack = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Login' component={Login}/>
            <Stack.Screen name='Register' component={Register} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthScreenStack;