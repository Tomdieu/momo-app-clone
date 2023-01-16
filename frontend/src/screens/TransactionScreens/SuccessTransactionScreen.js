import { StyleSheet, Text, View, NativeModules, SafeAreaView, Platform, ActivityIndicator } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'

import { useLanguageContext } from '../../context/LangContext';


import TransactionComplete from '../../components/TransactionComplete'


const { StatusBarManager } = NativeModules

const SuccessTransactionScreen = ({ navigation, route }) => {

  console.log("Enter")
  const { i18n } = useLanguageContext()

  const { data, type } = route.params;

  return (
    <SafeAreaView style={{
      ...styles.container, paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}>
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 25, fontWeight: '700', textAlign: 'center', marginVertical: 10 }}>Transaction {data.data.state}</Text>
        <TransactionComplete data={data} type={type} />
        
        <CustomButton 
          title="Navigate To Account" 
          style={{ color: 'white' }} 
          onPress={() => {
              navigation.replace('Transaction')
              navigation.navigate('Account')
            }} 
            
        />
      </View>
    </SafeAreaView>
  )
}

export default SuccessTransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  transactionInfoContainer: {
    padding: 2,
    marginVertical: 10
  },
  text: {
    fontSize: 18,
    fontWeight: '600'
  }

})