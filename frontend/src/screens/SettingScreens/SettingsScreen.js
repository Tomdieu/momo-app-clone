import { StyleSheet, Text, View, SafeAreaView, NativeModules, TouchableOpacity } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import {useAuthContext} from '../../context/AuthContext'

const { StatusBarManager } = NativeModules

const SettingsScreen = ({navigation,route}) => {

  const {lestLogout} = useAuthContext()

  const navigate = (route) => {
    navigation.navigate(route)
  }

  return (
    <SafeAreaView style={{
      ...styles.container,
      paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
    }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '600',marginVertical:10 }}>Settings</Text>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={()=>navigate('profile')}>
            <View style={styles.option}>
              <Text style={styles.label}>My Informations</Text>
              <Feather name={'chevron-right'} size={16} style={styles.action} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigate('accountInfo')}>
            <View style={styles.option}>
              <Text style={styles.label}>Account</Text>
              <Feather name={'chevron-right'} size={16} style={styles.action} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.option}>
              <Text style={styles.label}>Security</Text>
              <Feather name={'chevron-right'} size={16} style={styles.action} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigate('language')}>
            <View style={styles.option}>
              <Text style={styles.label}>Language</Text>
              <Feather name={'chevron-right'} size={16} style={styles.action} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={lestLogout}>
          <View style={styles.option}>
            <Text style={styles.label}>SignOut</Text>
            <MaterialIcons name={'logout'} size={16} style={styles.action} />
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  label: {
    paddingLeft: 5,
    fontSize: 18
  },
  action: {
    marginRight: 5,

  }
})