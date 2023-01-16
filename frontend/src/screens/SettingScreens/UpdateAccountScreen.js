import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Checkbox from 'expo-checkbox';
import CustomButton from '../../components/CustomButton';
import ApiService from '../../utils/ApiService'

import {useAuthContext} from '../../context/AuthContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button, Snackbar } from 'react-native-paper';


const UpdateAccountScreen = ({ navigation, route }) => {
  const { accountInfo } = route.params;
  const { token,setIsAgent } = useAuthContext()
  const [updatedAccountData,setUpdatedAccountData] = useState(accountInfo);
  const [_isAgent, _setIsAgent] = useState(accountInfo.is_agent)
  const [loading, setLoading] = useState(false);


  const [message, setMessage] = useState("");
   const [visible, setVisible] = React.useState(false);


  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const handleSubmit = () => {
    if (_isAgent !== updatedAccountData.is_agent) {
      setLoading(true);
      ApiService
        .updateAccount(updatedAccountData.id, { is_agent: _isAgent }, token)
        .then((res) => res.json())
        .then(dt => {
          console.log(dt)
          setIsAgent(dt.is_agent)
          _setIsAgent(dt.is_agent);
          if(dt.is_agent){
            setVisible(true);
            setMessage("You are now an agent");
          }
          else{
            setVisible(true);
            setMessage("You are not more an agent"); 
          }
          setUpdatedAccountData({...updatedAccountData,...dt});
          AsyncStorage.setItem('isAgent',JSON.stringify({"agent":dt.is_agent}))

        })
        .catch(err => console.log(err))
        .finally(()=>{
          setLoading(false);
        })
    }
    else {
      setVisible(true);
      setMessage("You are already an agent")

    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, textAlign: 'center' }}>Update Account Type</Text>
      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Text style={{ fontSize: 20 }}>Agent</Text>
          <Checkbox
            value={_isAgent}
            onValueChange={(value) => _setIsAgent(value)}
          />
        </View>
        <CustomButton disabled={loading} loading={loading} onPress={handleSubmit} style={{ color: '#fff' }} title={'Update Account Status'} />
        <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Ok',
          onPress: () => {
          },
        }}>
        {message}
      </Snackbar>
      </View>
    </View>
  )
}

export default UpdateAccountScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8
  },
})