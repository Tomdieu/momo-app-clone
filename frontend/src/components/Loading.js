import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types';

import {MotiView} from 'moti'

const LoadingIndicator = ({size}) => {
    return (
        <MotiView style={{
            width:size,
            height:size,
            borderRadius:size/2,
            borderWidth:size/2,
            borderColor:'#fff',
            shadowColor:'#fff',
            shadowOffSet:{width:0,height:0},
            shadowOpacity:1,
            shadowRadius:10
        }}/>
    )
}

LoadingIndicator.propTypes = {
    size: PropTypes.number.isRequired
}


const Loading = (props) => {
  const {size} = props;
  return (
    <View style={styles.container}>
      <LoadingIndicator size={size}/>
    </View>
  )
}

Loading.propTypes = {
    size: PropTypes.number.isRequired
}


export default Loading

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})