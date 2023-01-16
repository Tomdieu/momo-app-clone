import { StyleSheet, Text, View, ScrollView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React,{useState} from 'react'
import CustomButton from '../../../components/CustomButton'
import UpdateProfileSchema from '../../../schema/UpdateProfileSchema'

import { useAuthContext } from '../../../context/AuthContext'

import { Formik } from "formik";

import ApiService from '../../../utils/ApiService'

const UpdateProfileScreen = ({ navigation, route }) => {
    const { data } = route.params;
    console.log(data)
    const { setUserInfo,token,userInfo } = useAuthContext()
    const [loading,setLoading] = useState(false)
    return (
        <View style={{ flex: 1 }}>
            <Formik
                initialValues={{
                    first_name: data.user.first_name,
                    last_name: data.user.last_name,
                    phone_number:data.phone_number,
                }}
                validationSchema={UpdateProfileSchema}
                onSubmit={(values) => {
                    const {first_name,last_name,phone_number} = values;
                    const profile = {user:{first_name,last_name},phone_number};
                    setLoading(true);
                    ApiService
                    .updateProfile(data.user.id,profile,token)
                    .then(res=>res.json())
                    .then(dt=>{
                        console.log(dt)
                        // setUserInfo({});
                    })
                    .catch((err)=>console.log(err))
                    .finally(()=>setLoading(false))
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, dirty,touched }) => (

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <React.Fragment>

                            <ScrollView
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{
                                    flex: 1,
                                    padding: 10
                                }}
                            >
                                <View style={styles.row}>
                                    <Text>Number</Text>
                                    <TextInput onChangeText={handleChange('phone_number')} onBlur={handleBlur('phone_number')} style={styles.textInput} editable={false} value={values.phone_number}/>
                                    {(errors.phone_number && touched.phone_number) && (<Text>{errors.phone_number}</Text>)}
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>First Name</Text>
                                    <TextInput style={styles.textInput} name="first_name" value={values.first_name} onChangeText={handleChange('first_name')} onBlur={handleBlur('first_name')} />
                                    {(errors.first_name && touched.first_name) && (<Text>{errors.first_name}</Text>)}
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Last Name</Text>
                                    <TextInput style={styles.textInput} name="last_name" value={values.last_name} onChangeText={handleChange('last_name')} onBlur={handleBlur('last_name')} />
                                    {(errors.last_name && touched.last_name) && (<Text>{errors.last_name}</Text>)}
                                </View>
                                {
                                    !data.phone_number ? (<View style={styles.row}>
                                    <Text style={styles.label}>Phone Number</Text>
                                    <TextInput style={styles.textInput} name="phone_number" value={values.phone_number} onChangeText={handleChange('phone_number')} onBlur={handleBlur('phone_number')} />
                                    {(errors.phone_number && touched.phone_number) && (<Text>{errors.last_name}</Text>)}
                                </View>):null   
                                }
                            </ScrollView>
                            <View style={{padding:8}}>
                                <CustomButton
                                    loading={loading}
                                    disabled={Boolean(!isValid || !dirty || loading)}
                                    onPress={handleSubmit}
                                    title='Updated'
                                    style={{ color: '#fff', backgroundColor: 'green' }}
                                />
                            </View>
                        </React.Fragment>
                    </TouchableWithoutFeedback>
                )}
            </Formik>
        </View>
    )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({
    row: {
        width: '100%',
        marginVertical: 10
    },
    label: {
        fontSize:20,
        fontWeight:"600"
    },
    textInput: {
        borderWidth: 1,
        padding: 8,
        fontSize:18,
        borderRadius:3
    }
})