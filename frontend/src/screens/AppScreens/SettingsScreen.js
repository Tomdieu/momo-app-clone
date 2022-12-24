import { StyleSheet, Text, View,SafeAreaView } from 'react-native'
import React from 'react'

const SettingsScreen = () => {
  return (
    <SafeAreaView style={{
      ...styles.container,
      paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}
    >

    </SafeAreaView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({})