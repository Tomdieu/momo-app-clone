import { StyleSheet, Text, View, TextInput,TouchableWithoutFeedback,Keyboard } from 'react-native'
import React,{useState,useEffect} from 'react'
import { Formik } from 'formik'

import { Button, Snackbar } from 'react-native-paper';

import UpdatePasswordSchema from "../../schema/UpdatePasswordSchema"
import CustomButton from '../../components/CustomButton'

import {useAuthContext} from '../../context/AuthContext'

import APiService from '../../utils/ApiService'



const ChangePasswordScreen = ({navigation}) => {

  const [loading,setLoading] = useState(false);
  const {token} = useAuthContext();
  const [message,setMessage] = useState(null);

  const [errMsg,setErrMsg] = useState(null);

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);



  return (
    <View style={styles.container}>
      <Text style={{fontSize:18,fontWeight:'400'}}>Change Password</Text>
      <Formik
        validationSchema={UpdatePasswordSchema}
        initialValues={{ old_password: '', new_password: '', confirm_password: '' }}
        onChange={{}}
        onSubmit={(values) => {
          setLoading(true);
          APiService
          .updatePassword(values,token)
          .then(res=>res.json())
          .then(data=>{
            if(data.success){
              setVisible(true)
              setMessage(data.message);

            }
            else{
              setVisible(true)
              setMessage(data.message);
              setErrMsg(data.message);
            }
          })
          .catch(err=>{
            setVisible(true);
            setMessage(data.message);
            setErrMsg(err.message);
          })
          .finally(()=>{
            setLoading(false);
          })
        }}
      >
        {({ handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          dirty }) => {
          return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <View>
                {errMsg && <View style={styles.errorContainer}><Text style={styles.errorText}>{errMsg}</Text></View>}
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Old Password</Text>
                <TextInput style={styles.textInput} name="old_password" onChangeText={handleChange('old_password')} onBlur={handleBlur('old_password')}/>
                {(errors.old_password && touched.old_password) && (<Text style={{color:'red'}}>{errors.old_password}</Text>)}
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>New Password</Text>
                <TextInput style={styles.textInput} name="new_password" onChangeText={handleChange('new_password')} onBlur={handleBlur('new_password')} />
                {(errors.new_password && touched.new_password) && (<Text style={{color:'red'}}>{errors.new_password}</Text>)}
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput style={styles.textInput} name="confirm_password" onChangeText={handleChange('confirm_password')} onBlur={handleBlur('confirm_password')} />
                {(errors.confirm_password && touched.confirm_password) && (<Text style={{color:'red'}}>{errors.confirm_password}</Text>)}
              </View>
  
              <CustomButton onPress={handleSubmit} loading={loading} disabled={Boolean(loading || !isValid || !dirty)} title={'Updated Password'} style={{backgroundColor:'#000',color:'#fff'}}/>
              <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                  label: 'Ok',
                  onPress: () => {
                    // Do something
                  },
                }}>
                {message}
              </Snackbar>
            </View>
            </TouchableWithoutFeedback>
            )
        }}
      </Formik>
    </View>
  )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  label:{
    fontSize:17,
    fontWeight:'400'
  },
  row: {
      width: '100%',
      marginVertical: 10
  },
  textInput: {
    borderWidth: 1,
    padding: 8,
    fontSize:18,
    borderRadius:3
  },
  errorContainer:{
    marginVertical:8,
    padding:8,
    backgroundColor:'red',
    borderRadius:5
  },
  errorText:{
    color:'#fff',
    textAlign:'center',
    fontSize:20
  }
})