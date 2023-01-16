import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import IconButtonArrow from '../../components/IconButtonArrow'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

import {useLanguageContext} from '../../context/LangContext'


const SecurityScreen = ({navigation}) => {
    const {i18n} = useLanguageContext();
  return (
    <View style={styles.container}>
        <View>
        <IconButtonArrow
            style={{backgroundColor:'#0f0'}}
            leftIcon={<MaterialCommunityIcons name="cash-lock" color={"#fff"} size={24}/>} 
            label={i18n.t('Change pin code')}
            onPress={()=>navigation.navigate('changePinScreen')}
            style={{backgroundColor:'green'}}
            rightIcon={<FontAwesome name='caret-right' color={"#fff"} size={24} />}
        />
        <IconButtonArrow
            style={{backgroundColor:'#0f0'}}
            leftIcon={<MaterialCommunityIcons name="account-lock" color={"#fff"} size={24}/>} 
            label={i18n.t('Change password')}
            onPress={()=>navigation.navigate('changePassword')}
            style={{backgroundColor:'green'}}
            rightIcon={<FontAwesome name='caret-right' color={"#fff"} size={24} />}
        />
        </View>
    </View> 
  )
}

export default SecurityScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:8
    }
})