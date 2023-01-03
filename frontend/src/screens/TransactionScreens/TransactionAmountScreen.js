import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import React,{useState} from 'react'

import { Formik } from "formik";

import CustomButton from '../../components/CustomButton'
import { Feather } from '@expo/vector-icons'

import {useLanguageContext} from '../../context/LangContext';

import AmountSchema from '../../schema/AmountSchema';

const TransactionAmountScreen = ({ navigation, route }) => {

    const { account,phoneNumber,type } = route.params;

    const {i18n} = useLanguageContext()

    const [amount,setAmount] = useState(0)

    return (
        <Formik 
            initialValues={{ amount: 0 }} 
            validationSchema={AmountSchema}
            onSubmit={(values) => {navigation.navigate('ConfirmTransaction',{account,phoneNumber,amount:values.amount,type})}}>
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
                        <Text style={{ fontSize: 18, color: 'ligthgrey' }}>{i18n.t('amtMsgTrsfer')}</Text>
                        <View>
                            <Text style={{textAlign:'center',marginVertical:9,fontWeight:'700'}}>{i18n.t('recieverInfo')}</Text>
                            <Text style={{fontSize:18,marginVertical:10,fontWeight:'500'}}>{i18n.t('name')} : {account.user.first_name + " " + account.user.last_name}</Text>
                            <Text style={{fontSize:18}}>{i18n.t('phoneNumber')} : {phoneNumber}</Text>
                        </View>
                        <View style={{marginVertical:10}}>
                            <View style={{marginVertical:10}}>
                                <Text style={{fontSize:18,marginVertical:8}}>{i18n.t('amount')}</Text>
                                <TextInput 
                                    style={styles.input} 
                                    name="amount" 
                                    keyboardType='numeric'
                                    value={values.amount}
                                    onChangeText={handleChange('amount')} 
                                    onBlur={handleBlur("amount")} 

                                />
                                {(errors.amount && touched.amount) &&
                                    <Text style={{ fontSize: 12,fontWeight:'900', color: 'red', paddingLeft: 8 }}>{errors.amount}</Text>
                                }
                            </View>
                            <CustomButton style={{color:'white'}} title={'Send'} onPress={handleSubmit} disabled={Boolean(!isValid || !dirty)}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </Formik>
    )
}

export default TransactionAmountScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:8
    },
    input:{
        borderColor:'#ddd',
        paddingVertical:10,
        backgroundColor:'#ddd',
        paddingHorizontal:8,
        borderRadius:5,
        textAlign:'center',
        fontSize:18,
        fontWeight:'600'
    }
})