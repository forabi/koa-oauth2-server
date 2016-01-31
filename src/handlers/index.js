import * as authorizationCode from './authorization_code';
import * as clientCredentials from './client_credentials';
import * as password from './password';
import * as token from './token';
import * as refreshToken from './refresh_token';

export const tokenHandlers = [
  token,
  authorizationCode,
  password,
  clientCredentials,
  refreshToken,
].map(h => h.handleTokenRequest);

export const authorizationHandlers = [
  authorizationCode,
].map(h => h.handleAuthorizationRequest);
