import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome} from '@expo/vector-icons'

const IconButtonArrow = (props) => {
    const { style={}, rightIcon,leftIcon, textColor="#fff", label, onPress } = props;
    return (
        <TouchableOpacity style={styles.padding} onPress={onPress}>
            <View style={{...styles.transaction_type,...style}}>
                <View style={{ flexDirection: 'row' }}>
                    {leftIcon}
                    <Text style={{ marginLeft: 5, color:textColor,fontSize:18 }}>{label}</Text>
                </View>
                {rightIcon}
            </View>
        </TouchableOpacity>
    )
}

export default IconButtonArrow

const styles = StyleSheet.create({
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