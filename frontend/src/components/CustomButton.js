import { StyleSheet, Text, TouchableOpacity,ActivityIndicator } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types'

const CustomButton = (props) => {
    const { title='Ok',loading=false,disabled = false, style = {}, onPress, onLongPress, ...others } = props;
    const { color } = style;
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} onLongPress={onLongPress} {...others} style={[{ ...styles.container, ...style },disabled && styles.touchableDisabled]}>
        
        {!loading?(<Text style={{ ...styles.text,color }}>{title}</Text>):(<ActivityIndicator color={"#fff"}/>)}
        </TouchableOpacity>
    )
}

CustomButton.propTypes = {
    title:PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress:PropTypes.func
}

export default CustomButton

const styles = StyleSheet.create({
    container: { elevation: 6, width: '100%', backgroundColor: 'black', borderRadius: 5, justifyContent: 'center', alignItems: 'center', paddingVertical: 15 },
    text: { color: '#fff', fontWeight: '800', textAlign: 'center', margin: 3 },
    touchableDisabled: {
        backgroundColor: "grey",
      },
})