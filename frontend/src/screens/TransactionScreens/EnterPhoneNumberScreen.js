import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from "formik";

import CustomButton from '../../components/CustomButton'
import { Feather } from '@expo/vector-icons'

import APIService from '../../utils/ApiService'

import PhoneSchema from '../../schema/PhoneSchema'
import { useAuthContext } from '../../context/AuthContext';
import { useLanguageContext } from '../../context/LangContext';

import Fab from '../../components/Fab'


const EnterPhoneNumberScreen = ({ navigation,route }) => {

    const [phoneNumber, setPhoneNumber] = useState('')
    const {token} = useAuthContext();
    const [loading,setLoading] = useState(false);

    const {i18n} = useLanguageContext()
    const {type} = route.params

    useEffect(()=>{
        navigation.setOptions({ headerTitle: i18n.t('phoneNumber'), })
    },[])

    const getText = ()=>{
        if(type==='Transfer' || type==='Deposit'){
            return 'recieverPhone'
        }
        else{
            return 'phoneNumber'
        }
    }
    
    return (
        <Formik
            initialValues={{ phoneNumber: '' }}
            validationSchema={PhoneSchema}
            onSubmit={(values) => {
                setLoading(true);
                APIService
                .getAccountInfo('phone_number',values.phoneNumber,token)
                .then(res=>res.json())
                .then(data=>{
                    setLoading(false);
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
                        <Text style={{ fontSize: 18, color: 'ligthgrey' }}>{i18n.t('pleaseEnterPhoneNumber')}</Text>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ fontSize: 18, marginBottom: 8 }}>{i18n.t(getText())}</Text>
                                <View style={{ borderRadius: 5, flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center', borderWidth: 1, paddingHorizontal: 5 }}>
                                    <Feather name="hash" size={16} style={{ color: '#000', width: '5%' }} />
                                    <TextInput 
                                        name="phoneNumber" 
                                        maxLength={13} 
                                        style={styles.input} 
                                        keyboardType={'phone-pad'} 
                                        value={values.phoneNumber} 
                                        onChangeText={handleChange('phoneNumber')} 
                                        onBlur={handleBlur("phoneNumber")}     
                                    />
                                </View>
                                {(errors.phoneNumber && touched.phoneNumber) &&
                                    <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{i18n.t(errors.phoneNumber)}</Text>
                                }
                            </View>
                            <View>
                                <CustomButton loading={loading} title={i18n.t('continue')} onPress={handleSubmit} disabled={Boolean(!isValid || !dirty || loading)} style={{ color: 'white', backgroundColor: 'black' }} />
                            </View>
                        </View>
                        <Fab onPress={()=>navigation.replace('Transaction')} iconSize={15} iconName="left" style={{backgroundColor:'#4361ee',color:'#fff',borderRadius:10}}/>
                    </View>
                </TouchableWithoutFeedback>
            )}

        </Formik>
    )
}

export default EnterPhoneNumberScreen

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