import { StyleSheet, Text, View,TouchableWithoutFeedback } from 'react-native'
import React from 'react'

const EnterAccountNumberScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize:18,color:'grey'}}>Please enter the account number</Text>
      <View style={{flex:1}}>
        <View style={{marginVertical:20}}>
            <Text style={{fontSize:18}}>Account Number</Text>
            <TextInput style={styles.input}/>
        </View>
        <View>
            <TouchableOpacity style={{width:'100%',padding:10,backgroundColor:'green',margin:10,borderRadius:5}}>
                <Text style={{color:'#fff'}}>Ok</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default EnterAccountNumberScreen

const styles = StyleSheet.create({})