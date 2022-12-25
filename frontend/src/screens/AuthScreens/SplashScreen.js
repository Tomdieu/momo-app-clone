import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'

import { useAuthContext } from '../../context/AuthContext';

const SplashScreen = () => {
  const [animating, setAnimating] = useState(true);
  const { setIsLoading } = useAuthContext()
  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      setIsLoading(false)
    }, 1000);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../images/logo.png')}
        style={{ width: '90%', resizeMode: 'contain', margin: 30 }}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDFF',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
})