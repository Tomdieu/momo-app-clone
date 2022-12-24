import { StyleSheet, Text, View, NativeModules, TouchableOpacity ,SafeAreaView} from 'react-native'
import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from 'react-native-vector-icons/Feather'

const { StatusBarManager } = NativeModules

const SelectTransactionTypeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{
      ...styles.container,
      // paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}
    >
      <View style={{ flex: 1,padding:8 }}>
        <Text style={styles.title}>Select options</Text>
        <TouchableOpacity>
          <View style={styles.option}>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <Feather name={'phone'} size={16} />
              <Text style={{paddingLeft:5}}>Phone Number</Text>
            </View>
            <Feather name={'chevron-right'} size={16} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.option}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name={'hash'} size={16} />
              <Text style={{paddingLeft:5}}>Account Number</Text>
            </View>
            <Feather name={'chevron-right'} size={16} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SelectTransactionTypeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '600'
  },
  option: {
    flexDirection: 'row',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    margin:5
  }
})