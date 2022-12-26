import { createStackNavigator } from '@react-navigation/stack'

import SelectTransactionTypeScreen from '../screens/TransactionScreens/SelectTransactionTypeScreen'
import NotificationDetail from '../screens/NotificationScreens/NotificationDetailScreen'
import Notifications from '../screens/NotificationScreens/NotificationScreen'

const Stack = createStackNavigator()


const NotificationStack = ({ navigation }) => {

    return (
        <Stack.Navigator>
            <Stack.Screen name='Notifications' component={Notifications} options={{headerShown:false}}/>
            <Stack.Screen name="NotificationDetail" component={NotificationDetail} options={{headerTitle:'Notification Detail'}}/>
        </Stack.Navigator>
    )

}


export default NotificationStack