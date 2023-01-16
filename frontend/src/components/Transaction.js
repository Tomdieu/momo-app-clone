import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../utils/constants'
import { useAuthContext } from "../context/AuthContext"
import { useLanguageContext } from '../context/LangContext';
import { MaterialCommunityIcons } from '@expo/vector-icons'

import moment from 'moment'

const Transaction = ({ data,style }) => {
    const { i18n } = useLanguageContext();
    const { userInfo } = useAuthContext()
    const getTitle = (type) => {

        switch (type) {
            case 'withdraw':
                return 'Withdraw'
                break;
            case 'transfer':
                return 'Transfer'
                break;
            case 'deposit':
                return 'Deposit'
            default:
                break;
        }

    }

    const getReciever = (type) => {
            return data.reciever.user.full_name;   
    }

    const getOwner = (type) => {
        return data.sender.user.full_name;
    }

    const getIconName = (type) => {
        switch (type) {
            case 'transfer':
                return 'send'
            case 'deposit':
                return 'cash-plus'
            case 'withdraw':
                return 'cash-remove'
        }
    }

    return (
        <View style={{...styles.transaction,...style}}>
            <View style={{ flexDirection: 'row',alignItems:'center' }}>
                <View style={styles.transaction_icon}>
                    <MaterialCommunityIcons style={{transform:[{rotateX:'20deg'}]}} name={getIconName(data.type)} size={24} color={COLORS.black} />
                </View>
                <View style={styles.transaction_info}>
                    <Text style={{ fontSize: 15, fontWeight: '700', justifyContent: 'flex-end' }}>{getTitle(data.type)}</Text>
                    <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: '700' }}>From</Text> {getOwner(data.type)}</Text>
                    <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: '700' }}>To</Text> {getReciever(data.type)}</Text>
                    <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: '700' }}>On</Text> {moment(data.created_at).format('DD MMM YYYY')}</Text>
                </View>
            </View>
            <View style={styles.transaction_amount}>
                <Text style={{ flex: 1 }}>XAF {i18n.numberToDelimited(data.amount)}</Text>
            </View>
        </View>
    )
}

export default Transaction

const styles = StyleSheet.create({
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
        marginVertical: 5,
        padding: 5,
        paddingVertical: 10,
        borderRadius: 2,
    },

    transaction_icon: {
        padding: 10
    },
    transaction_amount: {
        fontSize: 14,
        fontWeight: '700',
    }
})