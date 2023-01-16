import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'

import CheckBox from 'expo-checkbox'

import APIService from '../../utils/ApiService'
import { useAuthContext } from '../../context/AuthContext';
import Loading from '../../components/Loading';

import CustomButton from '../../components/CustomButton'
import { useLanguageContext } from '../../context/LangContext';
import { FontAwesome } from '@expo/vector-icons';

const AccountInfoScreen = ({ navigation }) => {
    const [accountInfo, setAccountInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useAuthContext()
    const { i18n } = useLanguageContext()

    useEffect(() => {
        APIService
            .account(token)
            .then(res => res.json())
            .then(account => {
                setAccountInfo(account.data);
                setIsLoading(false)
            })
            .catch(err => console.error(err))
            .finally(()=>setIsLoading(false))
    }, []);

    if (isLoading) {
        return <Loading size={40} />
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{ marginBottom: 2 }}>
                <Text>Account Number</Text>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',borderWidth:1,borderRadius:5,paddingLeft:5}}>
                    <FontAwesome name='hashtag' />
                    <Text style={{...styles.textInput,flex:1,borderWidth:0}}>{accountInfo.account_number}</Text>
                </View>
            </View>
            <View>
                <Text>Balance</Text>
                <Text style={styles.textInput}>{i18n.numberToDelimited(accountInfo.balance)} XAF</Text>
            </View>
            <View>
                <Text>Converted Balance</Text>
                <Text style={styles.textInput}>{accountInfo.converted_currency}</Text>
            </View>
            <View style={styles.row}>
                <Text>Agent</Text>
                <CheckBox
                    value={accountInfo.is_agent}
                    disabled={true}
                />
            </View>
            <View>
                <Text>Display Currency</Text>
                <Text style={styles.textInput}>{accountInfo.display_currency}</Text>
            </View>
            {/*<CustomButton onPress={()=>navigation.navigate('updatedAccount',{accountInfo})} title='update' style={{ color: '#fff', marginTop: 5, paddingVertical: 12 }} /> */}
        
        </ScrollView>
    )
}

export default AccountInfoScreen

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
    textInput: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 4
    }
})