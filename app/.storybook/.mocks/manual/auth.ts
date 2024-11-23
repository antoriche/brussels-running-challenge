/*
import { Auth } from 'aws-amplify';
import { fn } from '@storybook/test';
import { CognitoUserSession, CognitoIdToken, CognitoAccessToken, CognitoRefreshToken } from 'amazon-cognito-identity-js'

fn(Auth.currentSession).mockImplementation(async () => {
    return new CognitoUserSession({
        IdToken: new CognitoIdToken({
            IdToken: 'mocked-id-token',
        }),
		AccessToken: new CognitoAccessToken({
            AccessToken: 'mocked-access-token',
        }),
		RefreshToken: new CognitoRefreshToken({
            RefreshToken: 'mocked-refresh-token',
        }),
    });
});
*/

// TODO: currently solved by overiding REACT_APP_SKIP_AUTH env variable
