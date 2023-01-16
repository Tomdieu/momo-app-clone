import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import AccountScreen from '../screens/AppScreens/AccountScreen'

import NotificationStack from './NotificationStack'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import TransactionNavigator from './TransactionStack'

import SettingStack from './SettingsStack'

import {useLanguageContext} from '../context/LangContext'


const Tab = createBottomTabNavigator()

const AppNavigator = () => {
  const {i18n} = useLanguageContext()
  const settings = i18n.t("settings");
  const compte = i18n.t('account')
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
      <Tab.Screen name="Account" component={AccountScreen} options={{
        tabBarLabel:compte,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="ios-wallet" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Transactions" component={TransactionNavigator} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="bank-transfer" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Notification" component={NotificationStack} options={{
        title: "Notifications",
        tabBarLabel: "Notifications",
        tabBarBadge: '',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="notifications" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Settings" component={SettingStack} options={{
        title: "Settings",
        tabBarLabel: settings,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings" color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
  )
}

export default AppNavigator 