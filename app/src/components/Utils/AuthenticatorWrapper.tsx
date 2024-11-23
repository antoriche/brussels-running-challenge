import React from "react";
import { shouldSkipAuth } from "../../App";
import { Authenticator } from "@aws-amplify/ui-react";
import LoginTheme from "../LoginTheme/LoginTheme";

type AuthenticatorWrapperProps = {
  children: React.ReactNode;
};
function AuthenticatorWrapper({ children }: AuthenticatorWrapperProps) {
  return (
    <>
      {shouldSkipAuth() ? children : React.createElement(Authenticator, { theme: LoginTheme, hideSignUp: true, children: ({}) => children } as never)}
    </>
  );
}

export default AuthenticatorWrapper;
