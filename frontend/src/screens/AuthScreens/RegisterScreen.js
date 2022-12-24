import {
  StyleSheet,
  Text,
  TextInput,
  View,
  NativeModules,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Formik } from "formik";
import { COLORS } from "../../utils/constants";
import { Button } from "react-native-paper";

const { StatusBarManager } = NativeModules;

const RegisterScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: Platform.OS == "android" ? StatusBarManager.HEIGHT : 0,
      }}
    >
      <ScrollView style={{ flex: 1 }}>
        <Formik
          initialValues={{
            username: "",
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            password: "",
            confirm_password: "",
          }}
          onSubmit={(values) => console.log(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
          }) => (
            <View>
              <Text style={styles.title}>Register</Text>
              <View>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  name="username"
                  placeholder="Username"
                  style={styles.textInput}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.first_name}
                  keyboardType="default"
                />
              </View>
              <View>
                <Text style={styles.label}>First name</Text>
                <TextInput
                  name="fist_name"
                  placeholder="First name"
                  style={styles.textInput}
                  onChangeText={handleChange("first_name")}
                  onBlur={handleBlur("first_name")}
                  value={values.first_name}
                  secureTextEntry
                />
              </View>
              <View>
                <Text style={styles.label}>Last name</Text>
                <TextInput
                  name="last_name"
                  placeholder="Last name"
                  style={styles.textInput}
                  onChangeText={handleChange("last_name")}
                  onBlur={handleBlur("last_name")}
                  value={values.last_name}
                />
              </View>
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  name="email"
                  placeholder="email"
                  style={styles.textInput}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
              </View>
              <View>
                <Text style={styles.label}>Phone number</Text>
                <TextInput
                  name="phone_number"
                  placeholder="Phone number"
                  style={styles.textInput}
                  onChangeText={handleChange("phone_number")}
                  onBlur={handleBlur("phone_number")}
                  value={values.phone_number}
                  keyboardType={"phone-pad"}
                />
              </View>
              <View>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  name="password"
                  placeholder="Password"
                  style={styles.textInput}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry
                />
              </View>
              <View>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  name="confirm_password"
                  placeholder="Confirm Password"
                  style={styles.textInput}
                  onChangeText={handleChange("confirm_password")}
                  onBlur={handleBlur("confirm_password")}
                  value={values.confirm_password}
                  secureTextEntry
                />
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn}>
                  <Button>
                    <Text style={{ color: "#fff" }}>Sign Up</Text>
                  </Button>
                </TouchableOpacity>
              </View>
              <Text style={{ textAlign: "center", marginBottom: 10 }}>
                Already a user ?{" "}
                <Text
                  style={{ color: "blue" }}
                  onPress={() => navigation.navigate("Login")}
                >
                  Login
                </Text>
              </Text>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    // textAlign: "center",
    fontWeight: "800",
  },
  label: {
    fontSize: 15,
    marginLeft: 5,
    fontWeight: "500",
  },
  textInput: {
    padding: 8,
    fontSize: 20,
    borderColor: "#ddd",
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
  },
  btn: {
    fontSize: 18,
    backgroundColor: COLORS.green,
    marginVertical: 8,
    fontWeight: "600",
    color: "#fff",
    borderRadius: 8,
    padding: 6,
  },
  btnContainer: {
    padding: 5,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#040121",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
