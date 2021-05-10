import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { LoginContext } from "./contexts/LoginContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [authToken, setAuthToken] = useState("");

  const fetchCache = async () => {
    const loginDate = await SecureStore.getItemAsync("loginDate");
    const loggedInBefore = await SecureStore.getItemAsync("loggedIn");
    const token = await SecureStore.getItemAsync("token");
    if (token && loggedInBefore) {
      if (parseInt(loginDate!) - Date.now() < 1209600000) {
        setAuthToken(token);
        setLoggedIn(loggedInBefore === "YES" ? true : false);
        console.log(token, loggedInBefore);
      } else {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("loggedIn");
        await SecureStore.deleteItemAsync("loginDate");
        alert("Login Expired");
      }
    }
  };

  fetchCache();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <LoginContext.Provider
          value={{
            loggedIn,
            setLoggedIn,
            userName,
            setUserName,
            authToken,
            setAuthToken,
          }}
        >
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </LoginContext.Provider>
      </SafeAreaProvider>
    );
  }
}
