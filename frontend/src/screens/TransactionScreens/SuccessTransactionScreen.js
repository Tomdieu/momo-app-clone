import { StyleSheet, Text, View, NativeModules, SafeAreaView, Platform,ActivityIndicator } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'

import {useLanguageContext} from '../../context/LangContext';


const { StatusBarManager } = NativeModules

const SuccessTransactionScreen = ({navigation,route}) => {

  const {i18n} = useLanguageContext()

  const {type,data} = route.params;

  return (
    <SafeAreaView style={{
      ...styles.container, paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}>
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontSize: 25, fontWeight: '700', textAlign: 'center', marginVertical: 10 }}>Transaction {data.data.state}</Text>
        <View style={styles.transactionInfoContainer}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.text}>Transaction Type </Text><Text> {type}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.text}>Transaction Code </Text><Text> {data.data.code}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.text}>Transaction State </Text><Text style={{color:'orange'}}> {data.data.state}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.text}>Transaction Amount </Text><Text> {i18n.numberToCurrency(data.data.amount,{unit:`${data.data.currency} `})}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.text}>Transaction Charge </Text><Text> {i18n.numberToPercentage(data.data.charge.charge*100,{precision:0})}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.text}>From </Text><Text> {data.data.withdraw_from.user.full_name}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.text}>To </Text><Text> {data.data.agent.user.full_name}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap'}}>
            <Text style={styles.text}>INFO </Text><Text style={{borderWidth:1,borderRadius:3,padding:5}}> {data.message}</Text>
          </View>
          
        </View>
        <ActivityIndicator size={50} color={''}/>
        <CustomButton title="Go Back" style={{color:'white'}} onClick={()=>navigation.back()}/>
      </View>
    </SafeAreaView>
  )
}

export default SuccessTransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  transactionInfoContainer:{
    padding:2,
    marginVertical:10
  },
  text:{
    fontSize:18,
    fontWeight:'600'
  }

})