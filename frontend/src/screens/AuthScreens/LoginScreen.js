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
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { COLORS } from "../../utils/constants";

const { StatusBarManager } = NativeModules;

import { useAuthContext } from '../../context/AuthContext'
import CustomButton from "../../components/CustomButton";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const { login, setToken, setUserInfo } = useAuthContext()

  const handleSubmit = () => {
    if (!username && !password) {
      return setError('username and password required')
    }
    else if (!username) {
      return setError('username  required')
    }
    else if (!password) {
      return setError('password required');
    }

    login(username, password)
      .then(res => res.json())
      .then((data) => {
        console.log('Response ', data);
        setToken(data.token);
        setUserInfo(data.data)

      })
      .catch(err => console.log('Error ', err))
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

              <Text style={styles.title}>Login</Text>
              <Image
                source={require("../../images/logo.png")}
                style={styles.logo}
              />
            </View>
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => setUsername(text)}
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

            <CustomButton title="Login" onPress={handleSubmit} disabled={Boolean(!username || !password)} style={{ color: '#fff' }} />

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
    fontWeight: "900",
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
    // fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.6)",
    borderRadius: 3,
    fontSize: 18,
    fontWeight: '800',
    backgroundColor: '#e3dede96'
  },
  btn: {
    padding: 20,
    height: 40,
    width: '100%'
  },
  text: {
    textAlign: "center",
  },
});
