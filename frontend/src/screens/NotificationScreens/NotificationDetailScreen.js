import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';

const NotificationDetail = ({ navigation, route }) => {
  const { notification } = route.params;
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{flex:1,paddingHorizontal:8}}>
      <Text style={{ fontSize: 18, fontWeight: '800' }}>INFO</Text>
      <Text style={{ fontSize: 22 }}>{notification.message}</Text>
      </View>
      <TouchableOpacity>
      <View style={styles.fab}>
        <AntDesign name='delete' style={{ color: 'white' }} size={24} />
      </View>
      </TouchableOpacity>
    </View>
  )
}

export default NotificationDetail

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
    height:70,
    width:70,
    borderRadius:35.5
  }
})