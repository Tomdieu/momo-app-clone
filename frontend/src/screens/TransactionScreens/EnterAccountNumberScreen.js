import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Formik } from "formik";

import CustomButton from '../../components/CustomButton'
import { Feather } from '@expo/vector-icons'

import APIService from '../../utils/ApiService'

import AccounNumberSchema from '../../schema/AccounNumberSchema'
import { useAuthContext } from '../../context/AuthContext';
import { useLanguageContext } from '../../context/LangContext';


const EnterAccountNumberScreen = ({ navigation,route }) => {

    const {token} = useAuthContext();

    const {i18n} = useLanguageContext()
    console.log(route)
    const {type} = route.params

    const getText = ()=>{
        if(type==='Transfer' || type==='Deposit'){
            return 'recieverAccountNumber'
        }
        else{
            return 'accountNumber'
        }
    }


    return (
        <Formik
            initialValues={{ account_number: '' }}
            validationSchema={AccounNumberSchema}
            onSubmit={(values) => {

                APIService
                .getAccountInfo('account_number',values.account_number,token)
                .then(res=>res.json())
                .then(data=>{
                    navigation.navigate('TransactionAmount', { type:type,account: data.data, phoneNumber: values.phoneNumber })
                })

            }}>
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
                dirty
            }) => (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <Text style={{ fontSize: 18, color: 'ligthgrey' }}>{i18n.t('pleaseEnterAccountNumber')}</Text>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ fontSize: 23, marginBottom: 8 }}>{i18n.t(getText())}</Text>
                                <View style={{ borderRadius: 5, flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center', borderWidth: 1, paddingHorizontal: 5 }}>
                                    <Feather name="hash" size={16} style={{ color: '#000', width: '5%' }} />
                                    <TextInput 
                                        name="account_number" 
                                        maxLength={13} 
                                        style={styles.input} 
                                        keyboardType={'phone-pad'} 
                                        value={values.account_number} 
                                        onChangeText={handleChange('account_number')} 
                                        onBlur={handleBlur("account_number")}     
                                    />
                                </View>
                                {(errors.account_number && touched.account_number) &&
                                    <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{i18n.t(errors.account_number)}</Text>
                                }
                            </View>
                            <View>
                                <CustomButton title={i18n.t('continue')} onPress={handleSubmit} disabled={Boolean(!isValid || !dirty)} style={{ color: 'white', backgroundColor: 'black' }} />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )}

        </Formik>
    )
}

export default EnterAccountNumberScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        fontSize: 18,
        marginLeft: 5,
        width: '95%'
    }
})