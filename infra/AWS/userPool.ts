import * as aws from "@pulumi/aws";
import { identifier } from "../constants";

export const pool = new aws.cognito.UserPool("userpool", {
  name: identifier,
  usernameAttributes: ["email"],
});

export const client = new aws.cognito.UserPoolClient("cognito-client", { userPoolId: pool.id });

export const identityPool = new aws.cognito.IdentityPool("identityPool", {
  identityPoolName: identifier,
  allowUnauthenticatedIdentities: false,
  allowClassicFlow: false,
  cognitoIdentityProviders: [
    {
      clientId: client.id,
      providerName: pool.endpoint,
      serverSideTokenCheck: false,
    },
  ],
});
