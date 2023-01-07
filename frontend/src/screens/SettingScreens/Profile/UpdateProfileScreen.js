import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import CustomButton from '../../../components/CustomButton'

const UpdateProfileScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <Text>Updat Profile</Text>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                }}
            >

            </ScrollView>
            <View>
                <CustomButton
                    title='Updated'
                    style={{ color: '#fff', backgroundColor: 'green' }}
                />
            </View>
        </View>
    )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({})