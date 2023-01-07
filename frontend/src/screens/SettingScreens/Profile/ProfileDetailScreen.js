import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import CustomButton from '../../../components/CustomButton'



const ProfileScreen = () => {
  const { useInfo } = useAuthContext()
  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>Profile</Text>
      <View>
        <View style={styles.row}>
          <Text>username</Text>
          <Text>{useInfo.user.username}</Text>
        </View>
        <View style={styles.row}>
          <Text>First name</Text>
          <Text>{useInfo.user.first_name}</Text>
        </View>
        <View style={styles.row}>
          <Text>Last name</Text>
          <Text>{useInfo.user.last_name}</Text>
        </View>
        <View style={styles.row}>
          <Text>email</Text>
          <Text>{useInfo.user.email}</Text>
        </View>
        <View style={styles.row}>
          <Text>phone_number</Text>
          <Text>{useInfo.user.phone_number}</Text>
        </View>
        <View style={styles.row}>
          <Text>City</Text>
          <Text>{useInfo.user.city}</Text>
        </View>

        <View>
          <CustomButton title='update' style={{ color: '#fff', backgroundColor: 'green' }} />
        </View>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})