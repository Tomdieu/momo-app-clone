import { createStackNavigator } from '@react-navigation/stack'

import TransactionScreen from '../screens/TransactionScreens/TransactionScreen'
import SelectTransactionTypeScreen from '../screens/TransactionScreens/SelectTransactionTypeScreen'
import ConfirmTransactionScreen from '../screens/TransactionScreens/ConfirmTransactionScreen'

import EnterPhoneNumberScreen from '../screens/TransactionScreens/EnterPhoneNumberScreen'
import TransactionAmountScreen from '../screens/TransactionScreens/TransactionAmountScreen'

const Stack = createStackNavigator()


const TransactionNavigator = ({ navigation,route }) => {

    return (
        <Stack.Navigator>
            <Stack.Screen name="Transaction" component={TransactionScreen} />
            <Stack.Screen name='TransactionType' component={SelectTransactionTypeScreen} options={{ headerTitle: 'Transaction options', headerTitleStyle: {textAlign:'center'}}} />
            <Stack.Screen name="InputPhone" component={EnterPhoneNumberScreen} options={{headerTitle:'Phone Number'}}/>
            <Stack.Screen name="TransactionAmount" component={TransactionAmountScreen} options={{headerTitle:'Transaction Amount'}}/>
            <Stack.Screen name="ConfirmTransaction" component={ConfirmTransactionScreen} />

        </Stack.Navigator>
    )

}

export default TransactionNavigator