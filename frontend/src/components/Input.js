import React, { useState } from "react";
import { View, Text, StyleSheet,TextInput } from "react-native";

import Icon  from "react-native-vector-icons";

import { COLORS } from "../utils/constants";

const Input = ({
  label,
  iconName,
  error,
  password,
  onFocus = () => {},
  ...props
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Icon
          name={iconName}
          style={{ fontSize: 22, color: COLORS.darkBlue, marginRight: 10 }}
        />
        <TextInput
          {...props}
          style={{ color: COLORS.darkBlue, flex: 1 }}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocus(true);
          }}
        />
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLORS.grey,
  },
  inputContainer: {
    height: 55,
    backgroundColor: COLORS.grey,
    flexDirection: "row",
    paddingHorizontal: 15,
    borderWidth: 0.5,
    alignItems: "center",
  },
});
