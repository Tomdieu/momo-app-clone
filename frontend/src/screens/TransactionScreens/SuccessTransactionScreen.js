import { StyleSheet, Text, View, NativeModules, SafeAreaView, Platform } from 'react-native'
import React from 'react'

const { StatusBarManager } = NativeModules

const SuccessTransactionScreen = () => {
  return (
    <SafeAreaView style={{
      ...styles.container, paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}>
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 25, fontWeight: '700', textAlign: 'center', marginVertical: 10 }}>Transaction SucessFull</Text>

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