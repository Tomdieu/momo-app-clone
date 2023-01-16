import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Deposit from '../screens/TransactionScreens/History/Deposit'
import Transfer from '../screens/TransactionScreens/History/Transfers'
import Withdraw from '../screens/TransactionScreens/History/Withdraw'


import {COLORS} from '../utils/constants'

const Tab = createMaterialTopTabNavigator();

function TransactionsTabStack() {
  return (
    <Tab.Navigator
      initialRouteName="Transfers"
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: COLORS.blue1 },
      }}
    >
      <Tab.Screen
        name="Transfers"
        component={Transfer}
        options={{ tabBarLabel: 'Transfers' }}
      />
      <Tab.Screen
        name="Withdraws"
        component={Withdraw}
        options={{ tabBarLabel: 'Withdraws' }}
      />
      <Tab.Screen
        name="Deposits"
        component={Deposit}
        options={{ tabBarLabels: 'Deposits' }}
      />
    </Tab.Navigator>
  );
}

export default TransactionsTabStack;