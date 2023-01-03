import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

import { useLanguageContext } from '../../context/LangContext';

const TransactionScreen = ({ navigation }) => {
  const { i18n } = useLanguageContext()
  const [isAgent, setIsAgent] = useState(false)
  const goToScreen = (transactionType) => {
    if (transactionType) {
      navigation.navigate('InputPhone', { type: transactionType })
    }
  }

  useEffect(() => {
    const _isAgent = AsyncStorage.getItem('isAgent');
    if (_isAgent) {
      setIsAgent(_isAgent)
    }
  })

  return (
    <View style={styles.container}>
      <Text style={{ marginTop: 10 }}>{i18n.t('selectTransactionType')}</Text>
      <View style={styles.transactions_type}>
        <TouchableOpacity style={styles.padding} onPress={() => goToScreen('Transfer')}>
          <View style={styles.transaction_type}>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesome name="send" color={'white'} size={24} />
              <Text style={{ marginLeft: 5, color: '#fff' }}>{i18n.t('transfer')}</Text>
            </View>
            <FontAwesome name='caret-right' color={'white'} size={24} />
          </View>
        </TouchableOpacity>
        {
          isAgent ? (
            <React.Fragment>

              <TouchableOpacity style={styles.padding} onPress={() => goToScreen('Deposit')}>
                <View style={styles.transaction_type}>
                  <View style={{ flexDirection: 'row' }}>
                    <MaterialCommunityIcons name="cash-plus" color={'white'} size={24} />
                    <Text style={{ marginLeft: 5, color: '#fff' }}>{i18n.t('deposit')}</Text>
                  </View>
                  <FontAwesome name='caret-right' color={'white'} size={24} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.padding} onPress={() => goToScreen('Withdraw')}>
                <View style={styles.transaction_type}>
                  <View style={{ flexDirection: 'row' }}>
                    <MaterialCommunityIcons name="cash-minus" color={'white'} size={24} />
                    <Text style={{ marginLeft: 5, color: '#fff' }}>{i18n.t('withdraw')}</Text>
                  </View>
                  <FontAwesome name='caret-right' color={'white'} size={24} />
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ) : null
        }
      </View>
    </View>
  )
}

export default TransactionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8
  },
  title: {
    fontSize: 16,
    color: '#ddd'
  },
  transactions_type: {
    flex: 1,
    paddingVertical: 10,
  },
  padding: {
    marginVertical: 10,
    borderRadius: 5
  },
  transaction_type: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4361ee',
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 5
  }
})