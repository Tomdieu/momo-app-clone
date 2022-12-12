import { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AuthScreen from "./screens/Auth";
import AccountScreen from "./screens/Wallet";

import AuthContext from "./context/AuthContext";

const Stack = createStackNavigator();

const Navigation = () => {
  const { user, token, isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Wallet" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
