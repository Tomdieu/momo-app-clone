import { View, Text } from "react-native";
import React from "react";

import { createStackNavigator } from '@react-navigation/stack';


import Login from "./Login";
import Register from "./Register";
import Home from './Home';

const Stack = createStackNavigator();

const AuthScreenStack = ({ navigation, route }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

export default AuthScreenStack;
