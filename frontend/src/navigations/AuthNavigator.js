import { View, Text } from 'react-native'
import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from '../screens/AuthScreens/LoginScreen'
import WelcomeScreen from '../screens/AuthScreens/WelcomeScreen'
import RegisterScreen from '../screens/AuthScreens/RegisterScreen'

const Stack = createStackNavigator()

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Welcome' component={WelcomeScreen} options={{headerShown:false}} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigator