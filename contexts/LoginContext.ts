import { createContext } from "react";

interface LoginContextInterface {
  loggedIn: boolean;
  setLoggedIn: any;
  userName: string;
  setUserName: any;
  authToken: string;
  setAuthToken: any;
}

export const LoginContext = createContext<LoginContextInterface>(
  {} as LoginContextInterface
);
