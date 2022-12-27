import { StyleSheet, Text, View, NativeModules } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const { StatusBarManager } = NativeModules

const ConfirmTransactionScreen = ({navigation,route}) => {


  return (
    <SafeAreaView style={{
      ...styles.container,
      // paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}>
      <View style={styles.confirm_container}>
        
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