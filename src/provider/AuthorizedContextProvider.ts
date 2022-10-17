import { createContext } from "react";

const AuthroizedContext = createContext({
  authenticated: true,
  setAuthenticated: (auth: any) => { }
});

export default AuthroizedContext;
