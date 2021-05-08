import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Text, View } from "../components/Themed";
import { LoginContext } from "../contexts/LoginContext";

export default function Logout() {
  const { setLoggedIn } = useContext(LoginContext);
  return (
    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TouchableOpacity
        style={styles.dangerBtn}
        onPress={() => {
          setLoggedIn(false);
        }}
      >
        <Text style={styles.dangerText}>Log Out </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  dangerBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#F44336",
    borderRadius: 15,
  },
  dangerText: {
    fontSize: 24,
    color: "white",
  },
});
