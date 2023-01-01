import { StyleSheet, Text, View, NativeModules, SafeAreaView, Platform,ActivityIndicator } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'

import Loading from '../../components/Loading'

const { StatusBarManager } = NativeModules

const SuccessTransactionScreen = () => {
  return (
    <SafeAreaView style={{
      ...styles.container, paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}>
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 25, fontWeight: '700', textAlign: 'center', marginVertical: 10 }}>Transaction SucessFull</Text>
        <Loading size={40} />
        <ActivityIndicator size={50} color={''}/>
        <CustomButton title="Go Back"/>
      </View>
    </SafeAreaView>
  )
}

export default SuccessTransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})