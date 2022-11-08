import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// screens
import Home from "./screens/Home";
import Login from "./screens/Login";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator>
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
              title: "Settings",
              tabBarLabel: "Profile",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
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
