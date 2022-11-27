import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";


// screens
import Home from "./screens/Home";
import Login from "./screens/Login";
import Profile from "./screens/Profile";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator style={{padding:10}}>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              title: "My Account",
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              headerShown:false,
              title: "Login",
              tabBarLabel: "Login",
              tabBarButton: () => null,
              tabBarVisible:false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={Profile}
            options={{
              title: "Settings",
              tabBarLabel: "Settings",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

// <Stack.Navigator>
//           <Stack.Screen
//             name="Home"
//             component={Home}
//             options={{ title: "Home" }}
//           />
//           <Stack.Screen name="Login" component={Login} />
//         </Stack.Navigator>
