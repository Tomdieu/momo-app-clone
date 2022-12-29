import { StyleSheet, Text, View, NativeModules, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'

const { StatusBarManager } = NativeModules

const ConfirmTransactionScreen = ({ navigation, route }) => {

  const [pinCode, setPinCode] = useState('')

  const handleChangePinCode = (value) => {
    setPinCode(value.replace(/[^0-9]/g, ''))
  }

  const goNext = () =>{
    navigation.navigate('SuccessTransactionScreen')
  }

  return (
    <SafeAreaView style={{
      ...styles.container,
      // paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.confirm_container}>
          <Text style={{ fontSize: 17 }}>Confirm Transaction</Text>
          <View style={{ marginVertical: 10 }}>
            <Text>Reciver : Ivan tom</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Amount : 10000 XAF</Text>
              <Text>Charges : 0.2%</Text>
            </View>
            <View>
              <Text>Amount Send : 9800 XAF</Text>
            </View>
          </View>
          <View>
            <TextInput
              value={pinCode}
              onChangeText={handleChangePinCode}
              style={styles.input}
              placeholder={'Pin Code'}
              maxLength={5}
              keyboardType={'numeric'}
              secureTextEntry

            />
            <CustomButton onPress={goNext} title='Confirm' style={{ color: '#fff' }} />
          </View>
        </View>
      </TouchableWithoutFeedback>

    </SafeAreaView>
  )
}

export default ConfirmTransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  confirm_container: {
    flex: 1,
    padding: 10
  },
  input: {
    marginVertical: 10,
    padding: 8,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'rgba(171,171,171,.3)'
  }
})