import React,{useEffect,useState,FlatList,ScrollView} from 'react'
import { View, Text,StyleSheet } from 'react-native'

import Transaction from '../../../components/Transaction';

import NoTransfer from '../../../components/NoTransfer';
import ShowTransaction from '../../../components/ShowTransaction';

import ApiService from '../../../utils/ApiService'

import {useAuthContext} from '../../../context/AuthContext'


const TransferScreen = ({navigation}) => {

	const [refreshing,setResfreshing] = useState(false);
	const [transactions, setTransactions] = useState([])
	const {token} = useAuthContext()

	useEffect(()=>{
		ApiService
		.transferList(token)
		.then(res=>res.json())
		.then(data=>{
			// console.log('transfers : ',data)
			setTransactions(data.data);
		})
		.catch(err=>console.log(err));
	},[]);


	return (
		<View style={styles.container}>
			<Text style={styles.title}>Transfers accomplish</Text>
			{transactions.length === 0 ? (<NoTransfer />):(<ShowTransaction type="transfer" tData={transactions}/>) }
			
		</View>
	)
}

export default TransferScreen


const styles = StyleSheet.create({
	container:{
		flex:1,
		padding:8
	},
	title:{
		fontSize:22,
		fontWeight:'600',
		marginVertical:10
	}
})