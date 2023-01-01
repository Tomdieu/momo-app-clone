import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Formik } from "formik";

import CustomButton from '../../components/CustomButton'
import { Feather } from '@expo/vector-icons'

import PhoneSchema from '../../schema/PhoneSchema'

const EnterPhoneNumberScreen = ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState('')

    const handleInput = (text) => {
        setPhoneNumber(text.replace(/[^0-9\+]/g, ''))
    }

    const goNext = () => {
        const data = {
            "id": 1,
            "converted_currency": "XAF 17040.0",
            "total_amount_transfer": 2000,
            "total_amount_recieve": 0,
            "total_amount_withdraw": 1000.0,
            "user": {
                "id": 1,
                "username": "ivantom",
                "first_name": "ivantom",
                "last_name": "admin",
                "email": "ivantomdio@gmail.com"
            },
            "account_number": "1000001",
            "balance": 17040.0,
            "account_status": "active",
            "currency": "XAF",
            "display_currency": "XAF",
            "created_at": "2022-11-29T14:19:50.371366Z",
            "updated_at": "2022-12-25T21:01:30.164242Z",
            "is_agent": true
        }

        navigation.navigate('TransactionAmount', { account: data, phoneNumber: phoneNumber })
    }

    return (
        <Formik
            initialValues={{ phoneNumber: '' }}
            validationSchema={PhoneSchema}
            onSubmit={(values) => {
                setPhoneNumber(values.phoneNumber);
                goNext()
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
                        <Text style={{ fontSize: 18, color: 'ligthgrey' }}>Please enter the phone number</Text>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ fontSize: 23, marginBottom: 8 }}>Reciever Phone</Text>
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
                                    <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{errors.phoneNumber}</Text>
                                }
                            </View>
                            <View>
                                <CustomButton title='Continue' onPress={handleSubmit} disabled={Boolean(!isValid || !dirty)} style={{ color: 'white', backgroundColor: 'black' }} />
                            </View>
                        </View>
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
        // borderWidth: 1,
        // borderColor: '#020202',
        // backgroundColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 8,
        fontSize: 18,
        // borderRadius: 5,
        marginLeft: 5,
        // textAlign: 'center',
        width: '95%'
    }
})