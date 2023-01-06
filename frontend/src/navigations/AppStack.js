import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import AccountScreen from '../screens/AppScreens/AccountScreen'
import SettingsScreen from '../screens/AppScreens/SettingsScreen'

import NotificationStack from './NotificationStack'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import TransactionNavigator from './TransactionStack'


const Tab = createBottomTabNavigator()

const AppNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Account" component={AccountScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="ios-wallet" color={color} size={size} />
        ),
      }}/>
      <Tab.Screen name="Transactions" component={TransactionNavigator} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="bank-transfer" color={color} size={size} />
        ),
      }}/>
      <Tab.Screen name="Notification" component={NotificationStack} options={{
        title: "Notifications",
        tabBarLabel: "Notifications",
        tabBarBadge:0,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="notifications" color={color} size={size} />
        ),
      }}/>
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        title: "Settings",
        tabBarLabel: "Settings",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings" color={color} size={size} />
        ),
      }}/>
    </Tab.Navigator>
  )
}

export default AppNavigator