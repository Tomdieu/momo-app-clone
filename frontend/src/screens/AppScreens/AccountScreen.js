import { StyleSheet, Text, View, NativeModules, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
const { StatusBarManager } = NativeModules;

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { COLORS } from '../../utils/constants'

const AccountScreen = ({ navigation }) => {

  const [transactionFilter, setTransactiontransaction] = useState('all')

  const goToScreen = (transactionType) => {
    if(!transactionType) return;
    navigation.navigate('Transactions',{screen:'TransactionType',params:{type:transactionType}})
  }

  return (
    <SafeAreaView style={{
      ...styles.container,
      paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: '800' }}>Welcome, ivantom</Text>

          <View style={styles.infoContainer}>
            <MaterialIcons name="account-balance" color={COLORS.white} size={32} />
            <Text style={{ color: COLORS.white, fontSize: 20 }}>1,000 XAF</Text>
          </View>
          <View style={{ ...styles.infoContainer, backgroundColor: COLORS.black,borderRadius:5, flexDirection: 'column' }}>
            <View style={styles.historyInfo}><FontAwesome name={'caret-up'} size={24} color={COLORS.white} />
              <Text style={{ ...styles.transactionsAmount, color: COLORS.green }}> {'+'} 100 XAF</Text>
            </View>
            <View style={styles.historyInfo}><FontAwesome name={'caret-down'} size={24} color={COLORS.white} />
              <Text style={{ ...styles.transactionsAmount, color: COLORS.lightRed }}> {'-'} 100 XAF</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity onPress={()=>goToScreen('Transfer')}>
              <View style={styles.btn}>
                {/*<FontAwesome name={'send'} size={24} color={COLORS.black} />*/}
                
                <MaterialCommunityIcons name={'bank-transfer'} size={32} color={COLORS.white} />

              </View>
              <Text>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>goToScreen('Withdraw')}>
              <View style={styles.btn}>
                <MaterialCommunityIcons name={'cash-minus'} size={32} color={COLORS.white} />
              </View>
              <Text style={{fontWeight:'bolder'}}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>goToScreen('Deposit')}>
              <View style={styles.btn}>
                <MaterialCommunityIcons name={'cash-plus'} size={32} color={COLORS.white} />
              </View>
              <Text>Top Up</Text>
            </TouchableOpacity>
          </View>
          <View style={{ ...styles.transactionContainer, flex: 1 }}>

            <View style={{ width: '100%', padding: 8, backgroundColor: COLORS.white }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 10 }}>Transactions</Text>
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setTransactiontransaction('all')}>
                  <Text style={{ ...styles.transactionCategory, color: transactionFilter === 'all' ? COLORS.white : COLORS.black, backgroundColor: transactionFilter === 'all' ? COLORS.black : COLORS.white }}>All</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setTransactiontransaction('transfer')}>
                  <Text style={{ ...styles.transactionCategory, color: transactionFilter === 'transfer' ? COLORS.white : COLORS.black, backgroundColor: transactionFilter === 'transfer' ? COLORS.black : COLORS.white }}>Transfer</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTransactiontransaction('withdraw')}>
                  <Text style={{ ...styles.transactionCategory, color: transactionFilter === 'withdraw' ? COLORS.white : COLORS.black, backgroundColor: transactionFilter === 'withdraw' ? COLORS.black : COLORS.white }}>Withdraw</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTransactiontransaction('deposit')}>
                  <Text style={{ ...styles.transactionCategory, color: transactionFilter === 'deposit' ? COLORS.white : COLORS.black, backgroundColor: transactionFilter === 'deposit' ? COLORS.black : COLORS.white }}>Top Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '700' }}>Current Transaction</Text>
                <Text style={{ textDecorationStyle: 'underline', color: COLORS.green }}>See all</Text>
              </View>
              <View style={styles.transactions}>
                <View style={styles.transaction}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={styles.transaction_icon}>
                      <MaterialCommunityIcons name={'home'} size={24} color={COLORS.black} />
                    </View>
                    <View style={styles.transaction_info}>
                      <Text style={{ fontSize: 14, fontWeight: '700',justifyContent:'flex-end' }}>Transfer to  {"ivantom"}</Text>
                      <Text style={{ fontSize: 10 }}>Ivantom tester</Text>
                      <Text style={{ fontSize: 10 }}>1 Dec 20222</Text>
                    </View>
                  </View>
                  <View style={styles.transaction_amount}>
                    <Text style={{ flex: 1 }}>XAF 40,000</Text>
                  </View>
                </View>


              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AccountScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    padding: 20,
    borderRadius: 4,
    marginVertical: 8,
    paddingVertical: 20,
  },

  historyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  transactionsAmount: {
    fontSize: 18,
    fontWeight: '400'
  },
  btn: {
    borderRadius: 5,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  transactionContainer: {

  },
  transactionCategory: {
    padding: 3,
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: 9,
    borderColor: COLORS.grey,
  },
  transactions: {
    paddingVertical: 5
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginVertical: 10,
    padding: 5,
    paddingVertical: 10,
    borderRadius: 2,
  },

  transaction_icon: {
    padding: 10
  },
  transaction_amount: {
    fontSize: 14,
    fontWeight: '700',
  }
})