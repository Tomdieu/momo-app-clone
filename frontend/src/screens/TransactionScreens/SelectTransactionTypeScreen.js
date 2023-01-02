import { StyleSheet, Text, View, NativeModules, TouchableOpacity ,SafeAreaView} from 'react-native'
import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from 'react-native-vector-icons/Feather'

import Fab from '../../components/Fab'

const { StatusBarManager } = NativeModules

import { useLanguageContext } from '../../context/LangContext';

const SelectTransactionTypeScreen = ({ navigation,route }) => {
  const { type } = route.params

  const {i18n} = useLanguageContext()

  const gotoNext = (route,type) =>{
    navigation.navigate(route,{type})
  }

  return (
    <SafeAreaView style={{
      ...styles.container,
      // paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}
    >
      <View style={{ flex: 1,padding:8 }}>
        <Text style={styles.title}>{i18n.t(`Select options for ${type}`)}</Text>
        <TouchableOpacity onPress={()=>gotoNext('InputPhone',type)}>
          <View style={styles.option}>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <Feather name={'phone'} size={16} color='#fff'/>
              <Text style={{paddingLeft:5,color:'#fff'}}>{i18n.t('phoneNumber')}</Text>
            </View>
            <Feather name={'chevron-right'} size={16}  color='#fff'/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>gotoNext('InputAccountNumber',type)}>
          <View style={styles.option}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name={'hash'} size={16}  color='#fff'/>
              <Text style={{paddingLeft:5,color:'#fff'}}>{i18n.t('accountNumber')}</Text>
            </View>
            <Feather name={'chevron-right'} size={16}  color='#fff'/>
          </View>
        </TouchableOpacity>
      </View>
        <Fab onPress={()=>navigation.replace('Transaction')} iconSize={15} iconName="left" style={{backgroundColor:'#4361ee'}}/>
    </SafeAreaView>
  )
}

export default SelectTransactionTypeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    paddingLeft:5,
    paddingVertical:10
  },
  option: {
    flexDirection: 'row',
    paddingVertical: 15,
    marginVertical: 7,
    borderRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4361ee',//'white',
    padding: 8,
    margin:5
  }
})