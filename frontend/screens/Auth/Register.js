import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  StatusBar
} from "react-native";
import React, { useState, useEffect } from "react";
import {StatusBar} from 'expo-status-bar'

const Register = ({ navigation, route }) => {
  // console.log(route.params.isAuthenticated);

  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");

  const [user, setUser] = useState({
    user: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    phone_number: "",
    dob: "",
    city: "",
  });

  return (
    <ScrollView>
    <StatusBar />
      <View style={styles.screen}>
        <View style={styles.main}>
          <View style={styles.Container}>
            <Text style={styles.text}>Register | TrixWallet</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={(e) => console.log(e.text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>email</Text>
              <TextInput style={styles.input} keyboardType={'email-address'}/>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} keyboardType={'visible-password'} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of birth</Text>
              <TextInput style={styles.input}/>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} />
            </View>
            <Text
              style={styles.textLink}
              onPress={() => navigation.navigate("Home")}
            >
              Forgoten Password
            </Text>
            <View style={styles.inputContainer}>
              <Button title="register" style={styles.btn} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    // justifyContent:'center'
  },
  main: {
    flex: 1,
    padding: 8,
    margin: 5,
    borderRadius: 5,
    width: "90%",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "column",
    width: "100%",
    marginTop: 5,
  },
  Container: { padding: 10, flex: 1, justifyContent: "center" },
  btn: {
    padding: 8,
    fontSize: 15,
    borderRadius: 5,
  },
  textLink: {
    color: "blue",
    textAlign: "center",
    marginHorizontal: 6,
  },
});
