import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";

export default function Home({ navigation, route }) {
  return (
    <View style={style.main}>
      <Text>Home</Text>
      <Button
        style={style.btn}
        title={"Login"}
        onPress={() => navigation.navigate("Login", { isAuthenticated: false })}
      />
      <View style={style.mx}>
        {[1, 2, 3, 4, 5, 6].map((dt) => (
          <TouchableOpacity>
            <View
              style={{
                padding: 10,
                borderColor: "#ddd",
                borderWidth: 2,
                width: 100,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                margin: 0,
                backgroundColor:'#ddf'
              }}
            >
              <Text>{dt}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1 }}></View>
    </View>
  );
}

const style = StyleSheet.create({
  main: {
    flex: 1,
    padding: 8,
    // justifyContent:'center',ss
    // alignItems:'center',sss
    width: "100%",
    // backgroundColor:'blue'
  },
  btn: {
    padding: 10,
    fontSize: "bold",
    borderRadius: 15,
  },
  mx: {
    flex: 3,
    flexBasis: 300,
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 8,
    // alignItems:'center'
  },
});
