import { StyleSheet, Text, View, TouchableOpacity,ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

import IconButtonArrow from '../../components/IconButtonArrow'

import { useLanguageContext } from '../../context/LangContext';
import { useAuthContext } from '../../context/AuthContext';


const TransactionScreen = ({ navigation }) => {
  const { i18n } = useLanguageContext()
  const {isAgent} = useAuthContext();
  
  const goToScreen = (transactionType) => {
    if (transactionType) {
      navigation.navigate('InputPhone', { type: transactionType })
    }
  }


  return (
    <View style={styles.container}>
      <Text style={{ marginTop: 10,fontSize:20 }}>{i18n.t('selectTransactionType')}</Text>
      <View style={styles.transactions_type}>
        <TouchableOpacity style={styles.padding} onPress={() => goToScreen('Transfer')}>
          <View style={styles.transaction_type}>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesome name="send" color={'white'} size={24} />
              <Text style={{ marginLeft: 5, color: '#fff',fontSize:18 }}>{i18n.t('transfer')}</Text>
            </View>
            <FontAwesome name='caret-right' color={'white'} size={24} />
          </View>
        </TouchableOpacity>
        {
          isAgent ? (
            <React.Fragment>

              <TouchableOpacity style={styles.padding} onPress={() => goToScreen('Deposit')}>
                <View style={styles.transaction_type}>
                  <View style={{ flexDirection: 'row' }}>
                    <MaterialCommunityIcons name="cash-plus" color={'white'} size={24} />
                    <Text style={{ marginLeft: 5, color: '#fff',fontSize:18 }}>{i18n.t('deposit')}</Text>
                  </View>
                  <FontAwesome name='caret-right' color={'white'} size={24} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.padding} onPress={() => goToScreen('Withdraw')}>
                <View style={styles.transaction_type}>
                  <View style={{ flexDirection: 'row' }}>
                    <MaterialCommunityIcons name="cash-minus" color={'white'} size={24} />
                    <Text style={{ marginLeft: 5, color: '#fff',fontSize:18 }}>{i18n.t('withdraw')}</Text>
                  </View>
                  <FontAwesome name='caret-right' color={'white'} size={24} />
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ) : null
        }

        <View style={{flex:1}}>
          <Text style={{color:"#aaa",fontSize:20,fontWeight:'800'}}>Transactions History</Text>
          <IconButtonArrow
            style={{backgroundColor:'#0f0'}}
            leftIcon={<MaterialCommunityIcons name="bank-transfer" color={"#fff"} size={24}/>} 
            label={i18n.t('transactions')}
            onPress={()=>navigation.navigate('TransactionsAccomplish')}
            style={{backgroundColor:'green'}}
            rightIcon={<FontAwesome name='caret-right' color={"#fff"} size={24} />}
          />
          <IconButtonArrow
            style={{backgroundColor:'#0f0'}}  
            leftIcon={<MaterialCommunityIcons name="bank-transfer" color={"#fff"} size={24}/>} 
            label={'Pending Withdrawals'}
            onPress={()=>navigation.navigate('PendingWithdrawals')}
            style={{backgroundColor:'orange'}}
            rightIcon={<FontAwesome name='caret-right' color={"#fff"} size={24} />}
            />
        </View>
      </View> 
    </View>
  )
}

export default TransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8
  },
  title: {
    fontSize: 16,
    color: '#ddd'
  },
  transactions_type: {
    flex: 1,
    paddingVertical: 10,
  },
  padding: {
    marginVertical: 10,
    borderRadius: 5
  },
  transaction_type: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4361ee',
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 5
  }
})