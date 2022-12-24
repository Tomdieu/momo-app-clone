import { createStackNavigator } from '@react-navigation/stack'

import SelectTransactionTypeScreen from '../screens/TransactionScreens/SelectTransactionTypeScreen'


const Stack = createStackNavigator()


const TransactionNavigator = ({ navigation }) => {

    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerTitle: 'Transaction options', headerTitleStyle: {textAlign:'center'}}} name='TransactionType' component={SelectTransactionTypeScreen} />
        </Stack.Navigator>
    )

}


export default TransactionNavigator