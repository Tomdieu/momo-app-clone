import { StyleSheet, Text, View } from 'react-native'
import CheckBox from 'expo-checkbox'
import React, { useState, useEffect } from 'react'

import Loading from '../../components/Loading'

import APiService from '../../utils/ApiService'

import { useAuthContext } from '../../context/AuthContext'
import { useLanguageContext } from '../../context/LangContext'

const LanguageScreen = ({navigation,route}) => {
  const [en, setEng] = useState(true)
  const [isLoading, setIsLoading ] = useState(false)
  const { userInfo, setUserInfo, token } = useAuthContext()
  const { setLocale,i18n } = useLanguageContext();

  const [userLang,setUserLang] = useState({en:userInfo.lang==='EN',fr:userInfo.lang==='FR'}) 


  const handleChange = () => {
    console.log(userLang)
    setIsLoading(true);
    const data = { 'lang': userLang.en === true ? 'EN' : 'FR' }
    APiService
      .updateLanguage(data, token)
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        console.log(data.data.lang,data.data.lang.toLocaleLowerCase())
        setUserInfo(data.data);
        // setEng(data.data.lang === 'EN'?true:false)
        setLocale(data.data.lang.toLocaleLowerCase());
        setIsLoading(false)
      })

  }

  useEffect(()=>{
    handleChange();
  },[userLang])

  if (isLoading) {
    return <Loading size={50} />
  }

  console.log("The data change new value ",userLang)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('select a language')}</Text>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text>Francais</Text>
          <CheckBox 
            style={styles.checkbox} 
            value={userLang.fr} 
            onValueChange={() => {
              setUserLang({en:false,fr:true});
              // handleChange()
            }} 
          />
        </View>
        <View style={styles.box}>
          <Text>English</Text>
          <CheckBox 
            style={styles.checkbox} 
            value={userLang.en} 
            onValueChange={() => {
              setUserLang({en:true,fr:false});
              // handleChange()
            }} 
          />
        </View>
      </View>
    </View>
  )
}

export default LanguageScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20
  },
  box: {
    margin: 10,
    gap: 10,
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderRadius: 20
  },
  checkbox: {
    marginLeft: 8
  }
})