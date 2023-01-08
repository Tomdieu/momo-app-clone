import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { Formik } from 'formik'

import UpdatePasswordSchema from "../../schema/UpdatePasswordSchema"
import CustomButton from '../../components/CustomButton'

const ChangePasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Change Password</Text>
      <Formik
        validationSchema={UpdatePasswordSchema}
        initialValues={{ old_password: '', new_password: '', confirm_password: '' }}
        onSubmit={(values) => {

        }}
      >
        {({ handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          dirty }) => {
          <View style={{ flex: 1 }}>
            <View>
              <Text>Old Password</Text>
              <TextInput name="old_password" onChangeText={handleChange('old_password')} onBlur={handleBlur('old_password')} style={styles.input} />

            </View>
            <View>
              <Text>New Password</Text>
              <TextInput name="new_password" onChangeText={handleChange('new_password')} onBlur={handleBlur('new_password')} style={styles.input} />
            </View>
            <View>
              <Text>Confirm Password</Text>
              <TextInput name="confirm_password" onChangeText={handleChange('confirm_password')} onBlur={handleBlur('confirm_password')} style={styles.input} />
            </View>

            <CustomButton title={'Updated Password'} />
          </View>
        }}
      </Formik>
    </View>
  )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
})