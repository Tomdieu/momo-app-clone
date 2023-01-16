import { createStackNavigator } from '@react-navigation/stack'

import TransactionScreen from '../screens/TransactionScreens/TransactionScreen'
// import SelectTransactionTypeScreen from '../screens/TransactionScreens/SelectTransactionTypeScreen'
import ConfirmTransactionScreen from '../screens/TransactionScreens/ConfirmTransactionScreen'

import EnterPhoneNumberScreen from '../screens/TransactionScreens/EnterPhoneNumberScreen'
import TransactionAmountScreen from '../screens/TransactionScreens/TransactionAmountScreen'
import SuccessTransactionScreen from '../screens/TransactionScreens/SuccessTransactionScreen'

import PendingWithdrawalScreen from '../screens/TransactionScreens/PendingWithdrawalScreen'


import TransactionsStack from './TransactionsStack'

const Stack = createStackNavigator()


const TransactionNavigator = ({ navigation,route }) => {

    return (
        <Stack.Navigator>
            <Stack.Screen name="Transaction" component={TransactionScreen} />
            {/* <Stack.Screen name='TransactionType' component={SelectTransactionTypeScreen} options={{ headerTitle: 'Transaction options',headerTitleAlign:'center', headerTitleStyle: {textAlign:'center'}}} /> */}
            <Stack.Screen name="InputPhone" component={EnterPhoneNumberScreen} options={{headerTitle:'Phone Number',headerTitleAlign:'center'}}/>
            <Stack.Screen name="TransactionAmount" component={TransactionAmountScreen} options={{headerTitle:'Transaction Amount',headerTitleAlign:'center'}}/>
            <Stack.Screen name="ConfirmTransaction" component={ConfirmTransactionScreen} options={{headerTitle:'Confirm Transaction',headerTitleAlign:'center'}}/>
            <Stack.Screen name="SuccessTransactionScreen" component={SuccessTransactionScreen} options={{'headerShown':false}}/>
            <Stack.Screen name="TransactionsAccomplish" component={TransactionsStack} options={{headerTitle:'Transactions',headerTitleAlign:'center'}}/>
            <Stack.Screen name="PendingWithdrawals" component={PendingWithdrawalScreen} options={{headerTitle:'Pending Withdrawal',headerTitleAlign:'center'}}/>
        </Stack.Navigator>
    )

}

export default TransactionNavigator