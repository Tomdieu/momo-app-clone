import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import ProfileScreen from '../screens/SettingScreens/Profile/ProfileDetailScreen'
import LanguageScreen from '../screens/SettingScreens/LanguageScreen'
import SettingScreen from '../screens/SettingScreens/SettingsScreen'
import ChangePinCodeScreen from '../screens/SettingScreens/ChangePinCodeScreen'
import ChangePasswordScreen from '../screens/SettingScreens/ChangePasswordScreen'
import UpdateProfileScreen from '../screens/SettingScreens/Profile/UpdateProfileScreen'

const Stack = createStackNavigator()


const SettingStack = ({ navigation }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen component={SettingScreen} name="settings" />
            <Stack.Screen component={ProfileScreen} name="profile" />
            <Stack.Screen component={UpdateProfileScreen} name="updatedProfile" />
            <Stack.Screen component={LanguageScreen} name="language" />
            <Stack.Screen component={ChangePinCodeScreen} name="changePinScreen" />
            <Stack.Screen component={ChangePasswordScreen} name="changePassword" />
        </Stack.Navigator>
    )
}; 

export default SettingStack