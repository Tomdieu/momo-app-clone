import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import AccountScreen from '../screens/AppScreens/AccountScreen'
import SettingsScreen from '../screens/AppScreens/SettingsScreen'
import NotificationScreen from '../screens/AppScreens/NotificationScreen'

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Account" component={AccountScreen}/>
      <Tab.Screen name="Notification" component={NotificationScreen}/>
      <Tab.Screen name="Settings" component={SettingsScreen}/>
    </Tab.Navigator>
  )
}

export default AppNavigator