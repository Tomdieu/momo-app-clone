import React,{useEffect,useState} from 'react'
import { View, Text,StyleSheet,ScrollView } from 'react-native'

import Transaction from '../../../components/Transaction';

import NoTransfer from '../../../components/NoTransfer';
import ShowTransaction from '../../../components/ShowTransaction';


import ApiService from '../../../utils/ApiService'

import {useAuthContext} from '../../../context/AuthContext'


const Deposit = ({navigation}) => {
	const [refreshing,setResfreshing] = useState(false);
	const [transactions, setTransactions] = useState([])
	const {token} = useAuthContext()

	useEffect(()=>{
		ApiService
		.depositList(token)
		.then(res=>res.json())
		.then(data=>{
			// console.log('transfers : ',data)
			setTransactions(data.data);
		})
		.catch(err=>console.log(err));
	},[]);


	return (
		<View style={styles.container}>
			<Text style={styles.title}>Deposits accomplish</Text>
			{transactions.length === 0 ? (<NoTransfer />):(<ShowTransaction type={'deposit'} tData={transactions}/>) }
			
		</View>
	)
}

export default Deposit

const styles = StyleSheet.create({
	container:{
		flex:1,
		padding:8
	},
	title:{
		fontSize:18
	}
})