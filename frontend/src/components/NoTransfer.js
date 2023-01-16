import React from 'react'
import { View, Text } from 'react-native'

const NoTransfer = () => {
	return (
    <View style={{ padding: 20, alignSelf: 'center',width:'100%',alignItems:'center',justifyContent:'center' }}>
        <Text style={{ fontSize: 20,fontWeight:'700',borderWidth:1,padding:20,width:'100%',textAlign:'center',borderRadius:3}}>No Transactions</Text>
    </View>
    )
}

export default NoTransfer