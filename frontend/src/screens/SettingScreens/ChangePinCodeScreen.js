
import { StyleSheet, Text, View, TextInput,TouchableWithoutFeedback,Keyboard } from 'react-native'
import React,{useState,useEffect} from 'react'
import { Formik } from 'formik'

import { Button, Snackbar } from 'react-native-paper';

import updatePinSchema from "../../schema/changePinSchema"
import CustomButton from '../../components/CustomButton'

import {useAuthContext} from '../../context/AuthContext'

import APiService from '../../utils/ApiService'



const ChangePinCodeScreen = ({navigation}) => {

  const [loading,setLoading] = useState(false);
  const {token} = useAuthContext();
  const [message,setMessage] = useState(null);

  const [errMsg,setErrMsg] = useState(null);

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);



  return (
    <View style={styles.container}>
      <Text style={{fontSize:18,fontWeight:'400'}}>Change Pin</Text>
      <Formik
        validationSchema={updatePinSchema}
        initialValues={{ old_pin: '', new_pin: '', confirm_pin: '' }}
        onChange={{}}
        onSubmit={(values) => {
          setLoading(true);
          APiService
          .changePinCode(values,token)
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
                <Text style={styles.label}>Old Pin</Text>
                <TextInput maxLength={5} secureTextEntry keyboardType='numeric' style={styles.textInput} name="old_pin" onChangeText={handleChange('old_pin')} onBlur={handleBlur('old_pin')}/>
                {(errors.old_pin && touched.old_pin) && (<Text style={{color:'red'}}>{errors.old_pin}</Text>)}
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>New Pin</Text>
                <TextInput maxLength={5} secureTextEntry keyboardType='numeric' style={styles.textInput} name="new_pin" onChangeText={handleChange('new_pin')} onBlur={handleBlur('new_pin')} />
                {(errors.new_pin && touched.new_pin) && (<Text style={{color:'red'}}>{errors.new_pin}</Text>)}
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Confirm Pin</Text>
                <TextInput maxLength={5} secureTextEntry keyboardType='numeric' style={styles.textInput} name="confirm_pin" onChangeText={handleChange('confirm_pin')} onBlur={handleBlur('confirm_pin')} />
                {(errors.confirm_pin && touched.confirm_pin) && (<Text style={{color:'red'}}>{errors.confirm_pin}</Text>)}
              </View>
  
              <CustomButton onPress={handleSubmit} loading={loading} disabled={Boolean(loading || !isValid || !dirty)} title={'Updated Pin'} style={{backgroundColor:'#000',color:'#fff'}}/>
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

export default ChangePinCodeScreen

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