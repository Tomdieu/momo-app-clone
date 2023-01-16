import React from 'react'
import { View, Text,ScrollView ,FlatList} from 'react-native'

import Transaction from './Transaction'

const ShowTransaction = ({tData,type}) => {
	return (
		<FlatList
          data={tData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
           <Transaction data={{...item,type}}/>
          )}
        />
	)
}

export default ShowTransaction