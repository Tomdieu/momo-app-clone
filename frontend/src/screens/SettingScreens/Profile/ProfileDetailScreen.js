import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import React from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import CustomButton from '../../../components/CustomButton'

import { useLanguageContext } from '../../../context/LangContext';


const ProfileScreen = ({navigation}) => {
  const { userInfo } = useAuthContext()
  const { i18n } = useLanguageContext();
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('username')}</Text>
          <TextInput style={styles.input} value={userInfo.user.username} disabled={true} editable={false} selectTextOnFocus={false} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('fname')}</Text>
          <TextInput style={styles.input} value={userInfo.user.first_name} disabled={true} editable={false} selectTextOnFocus={false} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('lname')}</Text>
          <TextInput style={styles.input} value={userInfo.user.last_name} disabled={true} editable={false} selectTextOnFocus={false} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('email')}</Text>
          <TextInput style={styles.input} value={userInfo.user.email} disabled={true} editable={false} selectTextOnFocus={false} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('phoneNumber')}</Text>
          <TextInput style={styles.input} value={userInfo.phone_number} disabled={true} editable={false} selectTextOnFocus={false} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('city')}</Text>
          <TextInput style={styles.input} value={userInfo.city} disabled={true} editable={false} selectTextOnFocus={false} />
        </View>

        <View>
          <CustomButton onPress={()=>navigation.navigate('updatedProfile',{data:userInfo})} title={i18n.t('update')} style={{ color: '#fff', backgroundColor: '#000', paddingVertical: 15 }} />
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  label: {
    fontSize: 20
  },
  input: {
    borderWidth: 1,
    padding: 3,
    paddingHorizontal: 10,
    borderRadius: 3,
    fontSize:20,
    paddingVertical:10
  },
  row: {
    flexDirection: 'column',
    marginBottom: 10,
    width: '100%'
  }
})