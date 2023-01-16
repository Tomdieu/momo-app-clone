import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  NativeModules,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

import React, { useState,useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Snackbar } from 'react-native-paper';

import { Feather } from "@expo/vector-icons";

const { StatusBarManager } = NativeModules;

import { useAuthContext } from '../../context/AuthContext'
import CustomButton from "../../components/CustomButton";

const LoginScreen = ({ navigation,route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const { login, setToken, setUserInfo } = useAuthContext()
  const [loading,setLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
  const [message,setMessage] = useState('');

  useEffect(()=>{
    setError(null);
  },[username,password]);

  useEffect(()=>{
    if(message){
      setVisible(true)
    }
  },[message]);

  useEffect(()=>{
    if(route){
      if(route.params){
        setMessage(route.params.message);
      }
    }
  },[]);

  const handleSubmit = () => {
    console.log(username,password);
    if (!username && !password) {
      return setError('username and password required')
    }
    else if (!username) {
      return setError('username  required')
    }
    else if (!password) {
      return setError('password required');
    }
    setLoading(true);
    login(username, password)
      .then(res => res.json())
      .then((data) => {
        console.log('Response ', data);
        if(data.success){
          setToken(data.token);
          setUserInfo(data.data)
        }
        else{
          setError(data.message);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err.message);
        setError(err.message);
        setLoading(false)
      })
  };

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <StatusBar style={"auto"} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.wrapper}>
            <View>

              <Image
                source={require("../../images/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Login</Text>
            </View>
            {error && <View style={{justifyContent:'space-between',alignItems:'center',flexDirection:'row',backgroundColor:'rgb(166,89,89)', padding:10,borderRadius:5}}>
              <Feather size={18} color={'#fff'} name="alert-triangle"/>
              <Text style={{color: '#fff',marginLeft:9,fontSize:18}}>{error}</Text>
            </View> }
            <View style={styles.inputContainer}>
              <Text style={styles.label}>username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => setUsername(text.trim().replace(/[^A-Za-z0-9]/g,''))}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>password</Text>
              <TextInput
                style={styles.input}
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
              />
            </View>

            <CustomButton loading={loading} title="Login" onPress={handleSubmit} disabled={Boolean(!username || !password || loading)} style={{ color: '#fff' }} />

            <View style={styles.inputContainer}>
              <TouchableOpacity style={{ ...styles.btn, color: (!username) ? 'grey' : 'default' }}>
                <Button
                  style={styles.btn}
                  title="Login"
                  onPress={() => navigation.navigate("Register")}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>
              Already have an account ?{" "}
              <Text
                style={{ color: "blue" }}
                onPress={() => navigation.navigate("Register")}
              >
                Register
              </Text>
            </Text>
            <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            action={{
              label: 'Ok',
              onPress: () => {
                // Do something
              },
            }}
            style={{backgroundColor: "lightgreen"}}
          >
            <View><Text style={{color:'#fff',padding:8,fontSize:20}}>{message}</Text></View>
          </Snackbar>
          </View>
          
          {/* <SnackBar visible={true} textMessage="Hello There!" actionHandler={()=>{console.log("snackbar button clicked!")}} actionText="let's go"/> */}
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: '#ECFDFF'
  },
  logo: {
    width: 158,
    height: 158,
  },
  title: {
    fontSize: 25,
    fontWeight: "400",
    textAlign: "center",
  },
  wrapper: {
    flex: 1,
    margin: 8,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 8,
    width: "100%",
  },
  label: {
    fontSize: 19,
    paddingVertical: 8,
  },
  input: {
    width: "100%",
    padding: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 3,
    fontSize: 18,
    fontWeight: '400',
    backgroundColor: '#e3dede96'
  },
  btn: {
    padding: 20,
    height: 40,
    width: '100%'
  },
  text: {
    textAlign: "center",
    fontSize:19
  },
});
