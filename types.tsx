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
  User: undefined;
};

export type UserParamList = {
  UserScreen: undefined;
};

export type HomeParamList = {
  HomeScreen: undefined;
};

export type UserType = {
  Firstname: string;
  Lastname: string;
  Fullname: string;
  RoleID: number;
  RoleName: string;
  Icon: string;
};
