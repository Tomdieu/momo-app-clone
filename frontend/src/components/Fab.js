import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';

const Fab = (props) => {
  const { iconName, style = {}, iconStyle = {}, iconSize = 24, onPress, onLongPress} = props;
  console.log(style)
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={{ ...styles.fab, ...style }}>
        <AntDesign name={iconName} style={{ ...styles.icon, ...iconStyle }} size={iconSize} />
      </View>
    </TouchableOpacity>
  )
}



export default Fab

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 70,
    width: 70,
    borderRadius: 35.5
  },
  icon: {
    color: 'white'
  }
})