import { RefreshControl,StyleSheet, Text, View, NativeModules, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
const { StatusBarManager } = NativeModules;
import { StatusBar } from 'expo-status-bar'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { COLORS } from '../../utils/constants'

import APIService from '../../utils/ApiService'

import { useAuthContext } from '../../context/AuthContext';
import { useLanguageContext } from '../../context/LangContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Transaction from '../../components/Transaction';


const AccountScreen = ({ navigation,route }) => {

  const [transactionFilter, setTransactiontransaction] = useState('all')
  const [accountDetail, setAccountDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true)
  const [latestTransactions,setLatestTransactions]=useState([]);
  const [transactionDetail, setTransactionDetail] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [reload,setReload] = useState(false);

  const { token,userInfo,setUserInfo,setIsAgent,isAgent } = useAuthContext();
  const { i18n } = useLanguageContext();

  const goToScreen = (transactionType) => {
    if (!transactionType) return;

    navigation.navigate('Transactions', { screen: 'InputPhone', params: { type: transactionType } })

    // navigation.navigate('Transactions',{screen:'TransactionType',params:{type:transactionType}})
  }

  if(route.params){
    if(route.params.reload){
      setReload(true);
    }
  }



  const loadData = () =>{
    APIService
      .account(token)
      .then(res => res.json())
      .then(account => {
        console.log(account)
        setAccountDetail(account.data);
        setIsLoading(false)
        setTimeout(() => {
          APIService
          .getProfile(token)
          .then(res=>res.json())
          .then(data=>{
            if(data.success){
              setUserInfo(data.data);
            }
          })
          .catch(err=>console.log(err))
          APIService
          .getLatestTransactions(token)
          .then(res=>res.json())
          .then(data=>{
            setIsAgent(account.data.is_agent);
            setLatestTransactions(data.data);
            setTransactionDetail(data.data);
            setTransactiontransaction('all');
          })
          .catch(err=>console.log(err))
        }, 2000);
      })
      .catch(err => console.error(err))
  }

  const onRefresh = React.useCallback(()=>{
    setRefreshing(true);
    console.log("onRefresh")
    APIService
      .account(token)
      .then(res => res.json())
      .then(account => {
        console.log(account)
        setAccountDetail(account.data);
        setIsAgent(account.data.is_agent);
        setIsLoading(false)
        setTimeout(()=>{
          setRefreshing(false);
          setTimeout(() => {
          APIService
          .getProfile(token)
          .then(res=>res.json())
          .then(data=>{
            if(data.success){
              setUserInfo(data.data);
            }
          })
          .catch(err=>console.log(err))
          APIService
          .getLatestTransactions(token)
          .then(res=>res.json())
          .then(data=>{
            setLatestTransactions(data.data);
            setTransactionDetail(data.data);
            setTransactiontransaction('all');
          })
          .catch(err=>console.log(err))
        }, 2000);
        },2000);
      })
      .catch(err => console.error(err))
  });

  useEffect(()=>{
    loadData();
  },[reload])

  useEffect(() => {
    loadData();
  }, [])

  useEffect(()=>{
    switch(transactionFilter){
      case 'all':
        setTransactionDetail(latestTransactions);
        break;
      case 'transfer':
      case 'deposit':
      case 'withdraw':
        const filter = latestTransactions.filter((trx)=>trx.type===transactionFilter)
        setTransactionDetail(filter)
    }
  },[transactionFilter])

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} color={COLORS.blue} />
    </View>
  }

  return (
    <SafeAreaView style={{
      ...styles.container,
      paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}
    >
      <StatusBar style="dark" animated backgroundColor={COLORS.bg}/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
      >
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: '800' }}>{i18n.t('welcome')}, {userInfo.user.username}</Text>

          <View style={styles.infoContainer}>
            <MaterialIcons name="account-balance" color={COLORS.white} size={32} />
            <Text style={{ color: COLORS.white, fontSize: 20 }}>{i18n.numberToDelimited(accountDetail.balance)} XAF</Text>
          </View>
          <View style={{ ...styles.infoContainer, borderRadius: 5, flexDirection: 'column' }}>
            <View style={styles.historyInfo}><FontAwesome name={'plus'} size={24} color={COLORS.green} />
              <Text style={{ ...styles.transactionsAmount, color: COLORS.green }}>  {i18n.numberToDelimited(accountDetail.total_amount_recieve)} XAF</Text>
            </View>
            <View style={styles.historyInfo}><FontAwesome name={'minus'} size={24} color={COLORS.lightRed} />
              <Text style={{ ...styles.transactionsAmount, color: COLORS.lightRed }}>  {i18n.numberToDelimited(accountDetail.total_amount_transfer + accountDetail.total_amount_withdraw)} XAF</Text>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={() => goToScreen('Transfer')}>
              <View style={styles.btn}>
                {/*<FontAwesome name={'send'} size={24} color={COLORS.black} />*/}

                <MaterialCommunityIcons name={'bank-transfer'} size={32} color={COLORS.white} />

              </View>
              <Text style={styles.btnText}>{i18n.t('transfer')}</Text>
            </TouchableOpacity>
            {
              isAgent && (
                <React.Fragment>
                  <TouchableOpacity onPress={() => goToScreen('Withdraw')}>
                    <View style={styles.btn}>
                      <MaterialCommunityIcons name={'cash-minus'} size={32} color={COLORS.white} />
                    </View>
                    <Text style={styles.btnText}>{i18n.t('withdraw')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => goToScreen('Deposit')}>
                    <View style={styles.btn}>
                      <MaterialCommunityIcons name={'cash-plus'} size={32} color={COLORS.white} />
                    </View>
                    <Text style={styles.btnText}>{i18n.t('deposit')}</Text>
                  </TouchableOpacity>
                </React.Fragment>
              )
            }
          </View>
          <View style={{ ...styles.transactionContainer, flex: 1 }}>

            <View style={styles.transactionContainer}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 10, ...styles.btnText }}>{i18n.t('transactions')}</Text>
              <View style={styles.transactionsFilter}>
                <TouchableOpacity onPress={() => setTransactiontransaction('all')}>
                  <Text style={{ ...styles.transactionCategory, color: transactionFilter === 'all' ? COLORS.white : COLORS.black, backgroundColor: transactionFilter === 'all' ? COLORS.black : COLORS.white }}>{i18n.t('all')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setTransactiontransaction('transfer')}>
                  <Text style={{ ...styles.transactionCategory, color: transactionFilter === 'transfer' ? COLORS.white : COLORS.black, backgroundColor: transactionFilter === 'transfer' ? COLORS.black : COLORS.white }}>{i18n.t('transfer')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTransactiontransaction('withdraw')}>
                  <Text style={{ ...styles.transactionCategory, color: transactionFilter === 'withdraw' ? COLORS.white : COLORS.black, backgroundColor: transactionFilter === 'withdraw' ? COLORS.black : COLORS.white }}>{i18n.t('withdraw')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTransactiontransaction('deposit')}>
                  <Text style={{ ...styles.transactionCategory, color: transactionFilter === 'deposit' ? COLORS.white : COLORS.black, backgroundColor: transactionFilter === 'deposit' ? COLORS.black : COLORS.white }}>{i18n.t('deposit')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', ...styles.btnText }}>{i18n.t('latest_transactions')}</Text>
                <Text style={{ textDecorationStyle: 'underline', color: COLORS.white }}>{i18n.t('seeAll')}</Text>
              </View>
              <View style={styles.transactions}>
                {transactionDetail?.map((data,index)=>{
                  return <Transaction key={index} data={data}/>
                })}
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
    padding: 8,
    backgroundColor: COLORS.bg
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.darkBlue,
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
  btnContainer: {
    backgroundColor: COLORS.darkBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5
  },
  btn: {
    borderRadius: 5,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: COLORS.blue1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  btnText: {
    color: COLORS.white
  },
  transactionContainer: {
    width: '100%',
    padding: 8,
    backgroundColor: COLORS.darkBlue,
    marginVertical: 5,
    borderRadius: 5
  },
  transactionCategory: {
    padding: 3,
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: 9,
    borderColor: COLORS.grey,
  },
  transactionsFilter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor:'navy'
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