import { CompositeNavigationProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import {
  TextInput,
  StyleSheet,
  Platform,
  PlatformColor,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { Text, View } from "../../components/Themed";

import { LoginContext } from "../../contexts/LoginContext";
import { RootScreens } from "../../navigation";
import { RootStackParamList } from "../../types";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, RootScreens.Login>;
}

export default function Login({ navigation }: Props) {
  const { userName, setUserName } = useContext(LoginContext);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="User name"
            placeholderTextColor={Platform.select({
              ios: PlatformColor("secondaryLabel"),
              android: PlatformColor("@android:color/white"),
            })}
          />
          <Button
            title="NEXT"
            accessibilityLabel="Click to continue your log in process"
            onPress={() => navigation.navigate("CapturePalm", { isLog: true })}
          />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.bottom}>
        <Text style={styles.info}>Don't have an account yet?</Text>
        <Button
          title="REIGSTER"
          color="#90caf9"
          accessibilityLabel="Click here to register an account"
          onPress={() => {
            navigation.navigate("Register");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "100%",
    marginTop: 10,
    marginBottom: 12,
    fontWeight: "500",
    borderWidth: 0.3,
    borderRadius: 5,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        color: PlatformColor("labelColor"),
        backgroundColor: PlatformColor("tertiarySystemBackground"),
        borderColor: PlatformColor("separator"),
      },
      default: {
        backgroundColor: "#1c1c1eff",
        borderColor: "#54545899",
      },
    }),
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    ...Platform.select({
      ios: { backgroundColor: PlatformColor("systemBackground") },
      default: {
        backgroundColor: "#000000ff",
      },
    }),
  },
  contentContainer: {
    flex: 1,
    maxHeight: "90%",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    ...Platform.select({
      ios: { backgroundColor: PlatformColor("systemBackground") },
      default: {
        backgroundColor: "#000000ff",
      },
    }),
  },
  form: {
    width: "90%",
    justifyContent: "space-between",
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 3,
    width: "100%",
  },
  bottom: {
    display: "flex",
    marginVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    color: "#ccc",
  },
});
