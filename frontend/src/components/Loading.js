import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PropTypes from 'prop-types';

import { View as MotiView } from 'moti'
import { COLORS } from '../utils/constants';

const LoadingIndicator = ({ size }) => {
    return (
        <MotiView

            from={{
                rotate: '0deg'
            }}

            animate={{
                rotate: '360deg',
            }}

            transition={{
                loop: true,
                repeatReverse: false,
                type: 'timing',
                duration: 100,
                delay: 0
            }}

            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 2,
                borderTopColor: 'rgb(68, 135, 213)',
                shadowOffSet: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 10
            }} />
    )
}

LoadingIndicator.propTypes = {
    size: PropTypes.number.isRequired
}


const Loading = (props) => {
    const { size } = props;
    return (
        <View style={styles.container}>
            <LoadingIndicator size={size} />
        </View>
    )
}

Loading.propTypes = {
    size: PropTypes.number.isRequired
}


export default Loading

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:COLORS.bg
    }
})