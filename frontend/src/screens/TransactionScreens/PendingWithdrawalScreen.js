import React,{useState,useEffect} from 'react'
import { View, Text,StyleSheet,ActivityIndicator,ScrollView,TouchableOpacity,RefreshControl } from 'react-native'

import {COLORS} from '../../utils/constants'

import Transaction from '../../components/Transaction'

import ApiService from '../../utils/ApiService'
import {useLanguageContext} from '../../context/LangContext';
import {useAuthContext} from '../../context/AuthContext';

const Btn = ({label,onPress,style}) => {
	return  (
		<TouchableOpacity onPress={onPress}>
			<View style={{...{backgroundColor:'red',padding:8,borderRadius:3},...style}}>
				<Text style={{color:'#fff',fontSize:19}}>{label}</Text>
			</View>
		</TouchableOpacity>
	)
}


const PendingWithdrawalScreen = () => {

	const {token} = useAuthContext();
	const [pendingTransactions,setPendingTransactions] = useState([]);
	const [loading,setLoading] = useState(false)

	const [refreshing, setRefreshing] = useState(false);
  	const [reload,setReload] = useState(false);

  	const onRefresh = React.useCallback(()=>{
  		setRefreshing(true)
		ApiService
		.pendingWithdrawals(token)
		.then(res=>res.json())
		.then(data=>{
			setPendingTransactions(data.data);
		})
		.catch(err=>console.log(err))
		.finally(()=>setRefreshing(false))
  	})

	const refresh = ()=>{
		setLoading(true)
		ApiService
		.pendingWithdrawals(token)
		.then(res=>res.json())
		.then(data=>{
			// console.log(data)
			setPendingTransactions(data.data);
		})
		.catch(err=>console.log(err))
		.finally(()=>setLoading(false))
	}

	useEffect(()=>{
		refresh();
	},[]);



	const acceptWithdraw = (id,data) => {
		ApiService
		.confirmOrDenyWithdrawals(id,data,token)
		.then(res=>res.json())
		.then(data=>{
			console.log(data);
			refresh();
		})
	}

	const accept = (id) =>{
		acceptWithdraw(id,{state:'ACCEPTED'});
	}

	const cancel = (id)=>{
		acceptWithdraw(id,{state:'CANCEL'});
	}

	if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} color={COLORS.blue} />
    </View>
  }


	return (
		<View style={styles.container}>
			
			
			

			<ScrollView
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>
				{pendingTransactions.length === 0 ?(<Text style={{fontSize:20,padding:20,textAlign:'center',fontWeight:'600'}}>No Pending Transactions</Text>):(<Text style={{fontSize:20,fontWeight:'300',margin:8}}>Pending Withdrawal</Text>) }
				{pendingTransactions?.map((data,index)=>{
					return (
						<View style={{width:'100%'}}>
							<Transaction data={data} type={'withdraw'}/>
							<View style={{padding:8,flexDirection:'row',justifyContent:'space-between'}}>
								<Btn label={'Cancel'} onPress={()=>cancel(data.id)} />
								<Btn label={'Accept'} onPress={()=>accept(data.id)} style={{backgroundColor:'green'}}/>
							</View>
						</View>

					)
				})}
			</ScrollView>
		</View>
	)
}

export default PendingWithdrawalScreen


const styles = StyleSheet.create({
	cntainer:{
		flex:1,
		padding:10
	}
})