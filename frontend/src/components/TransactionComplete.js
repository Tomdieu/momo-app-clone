import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useLanguageContext } from '../context/LangContext'

const TransactionComplete = ({ data,type }) => {
    console.log(data)
    const {i18n} = useLanguageContext()

    const getColor = (state) => {
        return state === 'PENDING'?'orange':'green'
    }

    return (
        <View style={styles.transactionInfoContainer}>
            <View style={styles.row}>
                <Text style={styles.text}>{i18n.t('Transaction Type')} </Text><Text> {i18n.t(type)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{i18n.t('Transaction code')} </Text><Text> {data.data.code}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{i18n.t('Transaction state')} </Text><Text style={{ color: getColor(data.data.status) }}> {data.data.status}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{i18n.t('Transaction Amount')} </Text><Text> {i18n.numberToCurrency(data.data.amount, { unit: `${data.data.currency} ` })}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{i18n.t('Transaction charge')} </Text><Text> {i18n.numberToPercentage(data.data.charge.charge * 100, { precision: 0 })}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{i18n.t('From')} </Text><Text> {data.data.sender.user.full_name}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{i18n.t('To')} </Text><Text> {data.data.reciever.user.full_name}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{i18n.t('Date')} </Text><Text> {moment(data.data.created_at).format('D/MM/YYYY HH:mm')}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Text style={styles.text}>{i18n.t('INFO')} </Text><Text style={styles.message}> {data.message} </Text>
            </View>

        </View>
    )

}

TransactionComplete.propType = {
    data: PropTypes.object.isRequired
}

export default TransactionComplete

const styles = StyleSheet.create({
    transactionInfoContainer: {
        padding: 10,
        marginVertical: 10,
        backgroundColor:'#ccc',
        borderRadius:5
    },
    row:{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        // borderBottomWidth:2,
        // borderBottomColor:'blue'
    },
    text: {
        fontSize: 18,
        fontWeight: '400'
    },
    message:{ borderWidth: 1, borderRadius: 3, padding: 5 ,flex:1}

})