import React, { useContext, useState } from "react";
import { StyleSheet, Image, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import { Text, View } from "../components/Themed";
import { LoginContext } from "../contexts/LoginContext";
import { UserType } from "../types";

export default function User({ navigation }: { navigation: any }) {
  const { loggedIn, authToken, setAuthToken, setLoggedIn } = useContext(
    LoginContext
  );
  const [userInfo, setUserInfo] = useState<UserType | undefined>(undefined);
  const fetchUser = async () => {
    const response = await fetch(
      "https://cisc4003.icac.tech/api/User/getSelfInfo",
      {
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      }
    );
    if (!response.ok) {
      // alert("Cannot fetch user info.");
    }
    const ret = await response.json();
    setUserInfo(ret.data);
    return;
  };

  fetchUser();

  const onLogout = async () => {
    if (authToken && loggedIn) {
      const response = await fetch(
        "https://cisc4003.icac.tech/api/Auth/logout",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );
      if (!response.ok) {
        alert("Something went wrong! Try again.");
        return;
      }
      const ret = await response.json();
      if (ret.data.Status === "Success") {
        setAuthToken("");
        setLoggedIn(false);
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("loggedIn");
        await SecureStore.deleteItemAsync("loginDate");
        alert("Logged Out");
        navigation.navigate("Login");
      } else {
        alert("Something went wrong! Try again.");
      }
    }
  };
  return (
    <View style={styles.container}>
      {userInfo && (
        <>
          {userInfo.Icon && (
            <Image style={styles.userIcon} source={{ uri: userInfo.Icon }} />
          )}
          {userInfo.Icon === null && (
            <Ionicons
              style={{ marginBottom: -3 }}
              size={128}
              name="person-circle-outline"
              color="#ccc"
            />
          )}
          <Text style={styles.title}>Welcome, {userInfo.Firstname} !</Text>
          <View
            style={styles.separatorSM}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <View
            style={styles.infoRow}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          >
            <Text style={styles.infoLabel}>First Name</Text>
            <Text style={styles.info}>{userInfo.Firstname}</Text>
          </View>
          <View
            style={styles.infoRow}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          >
            <Text style={styles.infoLabel}>First Name</Text>
            <Text style={styles.info}>{userInfo.Lastname}</Text>
          </View>
          <View
            style={styles.infoRow}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          >
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.info}>{userInfo.RoleName}</Text>
          </View>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
        </>
      )}
      <TouchableOpacity style={styles.dangerBtn} onPress={onLogout}>
        <Text style={styles.dangerText}>Log Out </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    display: "flex",
    flexDirection: "row",
    width: "60%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginVertical: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#aaa",
  },
  info: { fontSize: 16, fontWeight: "bold" },
  userIcon: {
    width: 128,
    height: 128,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
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
  separatorSM: {
    marginVertical: 15,
    height: 1,
    width: "60%",
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
