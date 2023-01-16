import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, NativeModules, Platform, Image, Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from 'react-native-vector-icons/AntDesign'
import React from "react";
const { StatusBarManager } = NativeModules
import { StatusBar } from 'expo-status-bar'

import {useLanguageContext} from '../../context/LangContext'


import { COLORS } from "../../utils/constants";

const WelcomeScreen = ({ navigation, route }) => {
  const {i18n} = useLanguageContext()
  return (
    <SafeAreaView style={{ ...styles.container,backgroundColor:COLORS.bg, paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0 }}>
      <StatusBar style="dark" animated backgroundColor={COLORS.bg}/>
      <View style={styles.container}>
        <Text style={{...styles.title,color:COLORS.darkBlue}}>Trix Wallet</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          <Image
            source={require("../../images/logo.png")}
            style={{height:300}}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <View style={styles.btn}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>{i18n.t('Get Started')}</Text>
            <AntDesign name="right" color={"white"} size={32} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    fontStyle: "normal",
    textAlign: 'center',
    paddingTop: 20
  },
  btn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.blue1,
    color: COLORS.white,
    margin: 4,
    flexDirection: 'row',
    borderRadius: 8,
    padding: 8,
    paddingVertical:15
  },
});
