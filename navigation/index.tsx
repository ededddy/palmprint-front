/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import { ColorSchemeName } from "react-native";
import { LoginContext } from "../contexts/LoginContext";
import CapturePalm from "../screens/Auth/CapturePalm";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

export enum RootScreens {
  Root = "Root",
  NotFound = "NotFound",
  Login = "Login",
  Register = "Register",
  CapturePalm = "CapturePalm",
}

function RootNavigator() {
  const { loggedIn } = useContext(LoginContext);
  return (
    <Stack.Navigator
      initialRouteName={RootScreens.Login}
      screenOptions={{ headerShown: false }}
    >
      {!loggedIn ? (
        <>
          <Stack.Screen name={RootScreens.Login} component={Login} />
          <Stack.Screen name={RootScreens.Register} component={Register} />
          <Stack.Screen
            name={RootScreens.CapturePalm}
            component={CapturePalm}
          />
        </>
      ) : (
        <Stack.Screen name={RootScreens.Root} component={BottomTabNavigator} />
      )}

      <Stack.Screen
        name={RootScreens.NotFound}
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
