import { StyleSheet, Text, View, NativeModules } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PINCode from '@haskkor/react-native-pincode';
const { StatusBarManager } = NativeModules

const ConfirmTransactionScreen = () => {

  const [pinCodeState, setPinCodeState] = useState({ PINCodeStatus: "choose", showPinLock: true })

  return (
    <SafeAreaView style={{
      ...styles.container,
      paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}>
      <View style={styles.confirm_container}>
        {pinCodeState.showPinLock && (
          <PINCode
            status={pinCodeState.PINCodeStatus}
            touchIDDisabled={true}
          />
        )}
      </View>

    </SafeAreaView>
  )
}

export default ConfirmTransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  confirm_container: {
    flex: 1
  }
})