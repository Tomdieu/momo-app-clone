import React, { Component } from "react";
import { Text, View } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AccountInfoScreen from "../Wallet/Info";
import NotificationScreen from "../Notification";

const Tab = createBottomTabNavigator();

export class index extends Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="AccountDetail" component={AccountInfoScreen} />
        <Tab.Screen name="Notification" component={NotificationScreen} />
      </Tab.Navigator>
    );
  }
}

export default index;
