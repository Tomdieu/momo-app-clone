import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Deposit from "./Deposit";
import Transfer from "./Transfer";
import Withdraw from "./Withdraw";
import Info from "./Info";

const Tab = createBottomTabNavigator();

const WalletStack = ({ navigation, route }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Info"
        screen={Info}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transfer"
        screen={Transfer}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bank-transfer-in"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Withdraw"
        screen={Withdraw}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bank-transfer-out"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Deposit"
        screen={Deposit}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bank-transfer"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default WalletStack;
