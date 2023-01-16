import {
  StyleSheet,
  Text,
  TextInput,
  View,
  NativeModules,
  ScrollView,
  Alert
} from "react-native";

import React,{useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Formik } from "formik";
import { COLORS } from "../../utils/constants";

import CustomButton from "../../components/CustomButton";

import { basicSchema } from '../../schema/UserSchema'

import ApiService from '../../utils/ApiService'

import { useAuthContext } from '../../context/AuthContext'

const { StatusBarManager } = NativeModules;


const RegisterScreen = ({ navigation }) => {

  const { setToken, setUserInfo } = useAuthContext()
  const [loading,setLoading] = useState(false);

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
          validationSchema={basicSchema}
          onSubmit={(values) => {
            setLoading(true);
            const { username, first_name, last_name, email, phone_number, password } = values;
            
            const user = {
              username, first_name, last_name, email, password
            }
            const profile = { phone_number,user }

            const data = JSON.stringify(user)
            console.log(data);
            ApiService.register(profile)
              .then(res => res.json())
              .then(data => {
                console.log(data);
                if(data.success){
                  navigation.navigate('Login',{message:data.message})
                }
                else{
                  Alert.alert("Could not create account",'Something went wrong',[
                    {
                    text: 'Ok',
                    onPress: () => {
                      
                    },
                  },
                  ])
                }
              })
              .catch(err=>console.log(err))
              .finally(()=>setLoading(false))

            console.log(values)
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
            dirty
          }) => (
            <View>
              <Text style={styles.title}>Register</Text>
              <Text style={{ color: '#bbb', fontWeight: '900', fontSize: 14, paddingHorizontal: 5, marginVertical: 5 }}>Be a trix wallet client</Text>
              <View>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  name="username"
                  placeholder="Username"
                  style={styles.textInput}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  keyboardType="default"
                />
                {(errors.username && touched.username) &&
                  <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{errors.username}</Text>
                }
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
                  keyboardType="default"
                />
                {(errors.first_name && touched.first_name) &&
                  <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{errors.first_name}</Text>
                }
              </View>
              <View>
                <Text style={styles.label}>Last name</Text>
                <TextInput
                  name="last_name"
                  placeholder="Last name"
                  style={styles.textInput}
                  onChangeText={handleChange("last_name")}
                  onBlur={handleBlur("last_name")}
                  keyboardType="default"
                  value={values.last_name}
                />
                {(errors.last_name && touched.last_name) &&
                  <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{errors.last_name}</Text>
                }
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
                  keyboardType="email-address"
                />
                {(errors.email && touched.email) &&
                  <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{errors.email}</Text>
                }
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
                {(errors.phone_number && touched.phone_number) &&
                  <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{errors.phone_number}</Text>
                }
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
                {(errors.password && touched.password) &&
                  <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{errors.password}</Text>
                }
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
                {(errors.confirm_password && touched.confirm_password) &&
                  <Text style={{ fontSize: 10, color: 'red', paddingLeft: 8 }}>{errors.confirm_password}</Text>
                }
              </View>

              <View style={styles.btnContainer}>

                <CustomButton 
                  loading={loading} 
                  onPress={handleSubmit} 
                  disabled={Boolean(!isValid || !dirty)} 
                  title={'Sign Up'} 
                  style={{ color: 'white', backgroundColor: COLORS.green }} 

                />


              </View>
              <Text style={{ textAlign: "center", marginVertical: 20,fontSize:19 }}>
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
    marginVertical: 8,
    marginLeft: 5
  },
  label: {
    fontSize: 15,
    marginLeft: 5,
    fontWeight: "500",
  },
  textInput: {
    padding: 8,
    lineHeight: 18,
    fontSize: 18,
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
