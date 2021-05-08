import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { LoginContext } from "./contexts/LoginContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <LoginContext.Provider
          value={{ loggedIn, setLoggedIn, userName, setUserName }}
        >
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </LoginContext.Provider>
      </SafeAreaProvider>
    );
  }
}
