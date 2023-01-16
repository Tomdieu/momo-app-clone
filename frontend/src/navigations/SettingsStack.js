import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import ProfileScreen from '../screens/SettingScreens/Profile/ProfileDetailScreen'
import LanguageScreen from '../screens/SettingScreens/LanguageScreen'
import SettingScreen from '../screens/SettingScreens/SettingsScreen'
import ChangePinCodeScreen from '../screens/SettingScreens/ChangePinCodeScreen'
import ChangePasswordScreen from '../screens/SettingScreens/ChangePasswordScreen'
import UpdateProfileScreen from '../screens/SettingScreens/Profile/UpdateProfileScreen'
import AccountInfoScreen from '../screens/SettingScreens/AccountInfoScreen'
import UpdateAccountScreen from '../screens/SettingScreens/UpdateAccountScreen'
import SecurityScreen from '../screens/SettingScreens/SecurityScreen'


import { useLanguageContext } from '../context/LangContext'

const Stack = createStackNavigator()


const SettingStack = ({ navigation }) => {
    const {i18n} = useLanguageContext();
    return (
        <Stack.Navigator>
            <Stack.Screen component={SettingScreen} name="settings" options={{headerShown: false}}/>
            <Stack.Screen component={ProfileScreen} name="profile" />
            <Stack.Screen component={UpdateProfileScreen} name="updatedProfile" />
            <Stack.Screen component={AccountInfoScreen} name="accountInfo" options={{headerTitle:"Account Info",headerTitleAlign:'center'}}/>
            <Stack.Screen component={UpdateAccountScreen} name="updatedAccount" options={{headerTitle:'Update Account',headerTitleAlign:'center'}} />
            <Stack.Screen component={LanguageScreen} name="language" options={{headerTitle:'Language'}}/>
            <Stack.Screen component={ChangePinCodeScreen} name="changePinScreen" />
            <Stack.Screen component={ChangePasswordScreen} name="changePassword" />
            <Stack.Screen component={SecurityScreen} name="SecurityScreen" options={{headerTitle:'Security'}}/>
            
        </Stack.Navigator>
    )
}; 

export default SettingStack