import { Alert,StyleSheet, Text, View, NativeModules, TouchableWithoutFeedback, Keyboard, TextInput,Modal,Pressable} from 'react-native'
import React, { useState,useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'

import {useLanguageContext} from '../../context/LangContext';
import {useAuthContext} from '../../context/AuthContext';

import APIService from '../../utils/ApiService'

const { StatusBarManager } = NativeModules

const ConfirmTransactionScreen = ({ navigation, route }) => {

  const [pinCode, setPinCode] = useState('')

  const {phoneNumber,account,amount,type} = route.params

  const [charge,setCharge] = useState(0);

  const [amountToSend,setAmountToSend] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);

  const [transaction,setTransaction] = useState({})

  const [error,setError] = useState('')

  const {token} = useAuthContext()

  const {i18n} = useLanguageContext()

  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    navigation.setOptions({ headerTitle: i18n.t('Confirm Transaction'), })
  },[])

  useEffect(()=>{
    APIService
    .getTransactionChargeInfo(type,token)
    .then(res=>res.json())
    .then(data=>{
      const chr = data.data.charge;
      setCharge(chr);

      const amt = amount - (amount*chr);

      setAmountToSend(amt);
    }).
    catch(e=>console.error(e))
  },[])

  const handleChangePinCode = (value) => {
    setPinCode(value.replace(/[^0-9]/g, ''))
  }

  const validatePinCode = () =>{
    setLoading(true);
    APIService
    .verifyPinCode(pinCode,token)
    .then(res=>res.json)
    .then(data=>{
      console.log("The data")
      // Create the transactions
      if(type==='Transfer'){
        data = {
            "pin_code": pinCode,
            "amount": amount,
            "reciever": account.id
          }
          APIService
          .transferMoney(data,token)
          .then(res=>res.json())
          .then(data=>{
            console.log(data)
            if(data.success){
              navigation.navigate('SuccessTransactionScreen',{data:data,type:type})
              setLoading(false);
            }
            else{
              setError(data.message)
              setModalVisible(true)
              setLoading(false);
            }
          })
          .catch(err=>{
            console.error(err)
            setError(err.message)
            setModalVisible(true)
            setLoading(false);
          })
        }

      else if(type==='Deposit'){
        data = {
            "pin_code": pinCode,
            "amount": amount,
            "reciever": account.id
          }
          APIService
          .depositMoney(data,token)
          .then(res=>res.json())
          .then(data=>{
            console.log(data)
            if(data.success){
              navigation.navigate('SuccessTransactionScreen',{data:data,type:type})
            }
            else{
              setError(data.message)
              setModalVisible(true)
            }
          })
          .catch(err=>{
            console.error(err)
            setError(err.message)
            setModalVisible(true)
          })
      }

      else if(type==='Withdraw'){
        data = {
            "pin_code": pinCode,
            "amount": amount,
            "withdraw_from": account.id
          }
          APIService
          .withdrawMoney(data,token)
          .then(res=>res.json())
          .then(data=>{
            console.log(data)
            if(data.success){
              navigation.navigate('SuccessTransactionScreen',{data:data,type:type})
            }
            else{
              setError(data.message)
              setModalVisible(true)
            }
          })
          .catch(err=>{
            console.error(err)
            setError(err.message)
            setModalVisible(true)
          })
      }
        
       
    })
    .catch(err=>{
      setLoading(false)
      console.error("Error Here",err.message)
      setError(err.message)
      setModalVisible(true)
      
    })
  }
  console.log("Modal visible",modalVisible)
  // i18n.numberToDelimited(12345678)
  return (
    <SafeAreaView style={{
      ...styles.container,
      // paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.confirm_container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{error}!</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
                </View>
            </View>
          </Modal>
          <Text style={{ fontSize: 25,color:'#3a86ff',fontWeight:'600' }}>{i18n.t('confirmTransaction')}</Text>
          <View style={{ marginVertical: 10 ,backgroundColor:'#000',padding:5,paddingVertical:10,borderRadius:5}}>
            <Text style={styles.text}>{i18n.t('reciever')} : {account.user.full_name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>{i18n.t('amount')} : {i18n.numberToCurrency(amount,{unit:'XAF '})}</Text>
              <Text style={styles.text}>{i18n.t('charges')} : {i18n.numberToPercentage(charge*100,{precision: 0,format:'%n %'})}</Text>
            </View>
            <View>
              <Text style={styles.text}>{i18n.t('amountSend')} : {i18n.numberToCurrency(amountToSend,{unit:'XAF '})}</Text>
            </View>
          </View>
          <View>
            <TextInput
              value={pinCode}
              onChangeText={handleChangePinCode}
              style={styles.input}
              placeholder={i18n.t('pinCode')}
              maxLength={5}
              keyboardType={'numeric'}
              secureTextEntry

            />
            <CustomButton loading={loading} disabled={Boolean(pinCode.length != 5)} onPress={validatePinCode} title='Confirm' style={{ color: '#fff' }} />
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
    padding: 10,
    paddingTop:5
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
    backgroundColor: 'rgba(199, 199, 199, 0.3)'
  },
  text:{
    color:'#ffffff',
    fontSize:15,
    fontWeight:'500',
    marginVertical:2
  },
  centeredView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  modalView:{
    backgroundColor:'#ccc',
    borderRadius:5,
    // width:'80%',
    // marginHorizontal:10,
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    padding:50,
    paddingBottom:10,
    alignItems:'center'
  },
  modalText:{
    color:'#e82539',
    fontSize:20,
    fontWeight:'600'
  },
  textStyle:{
    color:'#fff',
    fontSize:20,
    fontWeight:'600'
  },
  button:{
    justifyContent:'center',
    alignItems:'center',
    // alignSelf:'center',
    marginVertical:10,
    borderWidth:1,
    borderColor:'#000',
    width:'100%',
    backgroundColor:'#000',
    padding:10,
    borderRadius:5
  },
  buttonClose:{
    backgroundColor:'red',
    width:'100%'
  }
})