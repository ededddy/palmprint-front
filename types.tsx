/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NavigatorScreenParams } from "@react-navigation/core";
import { PalmParams } from "./screens/Auth/CapturePalm";

export type RootStackParamList = {
  Root: NavigatorScreenParams<BottomTabParamList>;
  NotFound: undefined;
  Login: undefined;
  Register: undefined;
  CapturePalm: PalmParams;
};

export type BottomTabParamList = {
  Home: undefined;
  Logout: undefined;
};

export type LogOutParamList = {
  LogoutScreen: undefined;
};

export type HomeParamList = {
  HomeScreen: undefined;
};
