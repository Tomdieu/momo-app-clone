import { StyleSheet, Text, View,Pressable } from 'react-native'
import React from 'react'
import { COLORS } from '../utils/constants'

const Button = ({title,style,...props}) => {
  return (
    <Pressable style={style} {...props}>
      <Text>{title}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
    title:{
        textAlign:'center',
        color:COLORS.white
    }
})