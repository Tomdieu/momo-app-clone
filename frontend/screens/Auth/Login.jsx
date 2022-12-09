import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import React, { useState, useEffect } from "react";

const Login = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const authenticate = () => {
    if (username && password) {
    }
  };

  return (
    <View style={styles.screen}>
      <Text>Login</Text>
      <view>
        {error && <View>{error}</View>}
        <View>
          <Text>Username</Text>
          <TextInput value={username} onChange={(e) => setUsername(e.text)} />
        </View>
        <View>
          <Text>Password</Text>
          <TextInput
            value={password}
            type={"password"}
            onChange={(e) => setPassword(e.text)}
          />
        </View>
        <View>
          <Button title={"Login"} styles={styles.btn} />
        </View>
      </view>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  input: {},
  btn: {},
});
