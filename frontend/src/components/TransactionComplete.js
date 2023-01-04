import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'
import { useLanguageContext } from '../context/LangContext'



const TransferOrDepositComplete = ({ data }) => {

    const {i18n} = useLanguageContext()

    return (
        <View style={styles.transactionInfoContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction Type </Text><Text> {type}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction Code </Text><Text> {data.data.code}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction State </Text><Text style={{ color: 'orange' }}> {data.data.state}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction Amount </Text><Text> {i18n.numberToCurrency(data.data.amount, { unit: `${data.data.currency} ` })}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction Charge </Text><Text> {i18n.numberToPercentage(data.data.charge.charge * 100, { precision: 0 })}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>From </Text><Text> {data.data.sender.user.full_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>To </Text><Text> {data.data.reciever.user.full_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Text style={styles.text}>INFO </Text><Text style={{ borderWidth: 1, borderRadius: 3, padding: 5 }}> {data.message}</Text>
            </View>

        </View>
    )
}

const WithdrawComplete = ({ data }) => {
    return (
        <View style={styles.transactionInfoContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction Type </Text><Text> {type}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction Code </Text><Text> {data.data.code}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction State </Text><Text style={{ color: 'orange' }}> {data.data.state}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction Amount </Text><Text> {i18n.numberToCurrency(data.data.amount, { unit: `${data.data.currency} ` })}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>Transaction Charge </Text><Text> {i18n.numberToPercentage(data.data.charge.charge * 100, { precision: 0 })}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>From </Text><Text> {data.data.withdraw_from.user.full_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.text}>To </Text><Text> {data.data.agent.user.full_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Text style={styles.text}>INFO </Text><Text style={{ borderWidth: 1, borderRadius: 3, padding: 5 }}> {data.message}</Text>
            </View>

        </View>
    )
}


const TransactionComplete = ({ data, type }) => {

    const TComponent = {
        "Transfer": <TransferOrDepositComplete data={data} />,
        "Deposit": <TransferOrDepositComplete data={data} />,
        "Withdraw": <WithdrawComplete data={data} />
    }

    return (
        TComponent[type]
    )
}

TransactionComplete.propType = {
    data: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
}

export default TransactionComplete

const styles = StyleSheet.create({
    transactionInfoContainer: {
        padding: 2,
        marginVertical: 10
    },
    text: {
        fontSize: 18,
        fontWeight: '600'
    }
})