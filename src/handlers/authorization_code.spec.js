/* eslint-disable func-names */
import expect, { createSpy } from 'expect';
import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';
import { handleAuthorizationRequest, handleTokenRequest } from './authorization_code';
import uniqueId from 'lodash.uniqueid';

describe('Authorization Code Grant Type', () => {
  describe('Authorization Request handler', () => {
    it('requires "response_type" of "code", otherwise calls next', async () => {
      const ctx = {
        request: {
          body: {
            response_type: null,
          },
        },
      };
      const fns = { };
      const next = createSpy();
      await handleAuthorizationRequest(fns)(ctx, next);
      expect(next).toHaveBeenCalled();
    });

    it('requires "client_id", otherwise rejects', async () => {
      const fns = {
        isClientValid() {
          return true;
        },
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id: '',
          },
        },
      };
      const errorHandler = createSpy().andCall(e => {
        expect(e.message).toMatch(/invalid input/i);
      });
      await handleAuthorizationRequest(fns)(ctx).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
    });

    it('should call client validation function', async () => {
      const isClientValid = createSpy();
      const client_id = uniqueId('client_');
      const fns = {
        isClientValid,
        getRedirectUri() {
          return uniqueId('http://forabi.net/post/');
        },
        createAuthorizationCode() {
          return uniqueId('auth_code_');
        },
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id,
          },
        },
        redirect() {
          return;
        },
      };
      await handleAuthorizationRequest(fns)(ctx);
      expect(isClientValid).toHaveBeenCalledWith({ client_id });
    });

    it('should not redirect if client is invalid', async () => {
      const isClientValid = createSpy().andCall(() => false);
      const createAuthorizationCode = createSpy();
      const redirect = createSpy();
      const client_id = uniqueId('client_');
      const fns = {
        isClientValid,
        getRedirectUri() {
          return uniqueId('http://forabi.net/post/');
        },
        createAuthorizationCode,
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id,
          },
        },
        redirect,
      };
      const errorHandler = createSpy().andCall(error => {
        expect(error.message).toMatch(/invalid.+client/i);
        expect(isClientValid).toHaveBeenCalledWith({ client_id });
        expect(createAuthorizationCode).toNotHaveBeenCalled();
        expect(redirect).toNotHaveBeenCalled();
      });
      await handleAuthorizationRequest(fns)(ctx).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
    });

    it('should call authorization code generation function', async () => {
      const createAuthorizationCode = createSpy();
      const client_id = uniqueId('client_');
      const fns = {
        isClientValid() {
          return true;
        },
        getRedirectUri() {
          return uniqueId('http://forabi.net/post/');
        },
        createAuthorizationCode,
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id,
          },
        },
        redirect() {
          return;
        },
      };
      await handleAuthorizationRequest(fns)(ctx);
      expect(createAuthorizationCode).toHaveBeenCalled();
    });

    it('should redirect to passed URI if it is valid', async () => {
      const getRedirectUri = createSpy();
      const isRedirectUriValid = createSpy().andCall(() => true);
      const client_id = uniqueId('client_');
      const redirect_uri = uniqueId('http://forabi.net/post/');
      const redirect = createSpy().andCall(url => {
        expect(url.startsWith(redirect_uri));
      });
      const fns = {
        isClientValid() {
          return true;
        },
        createAuthorizationCode() {
          return uniqueId('auth_code_');
        },
        getRedirectUri,
        isRedirectUriValid,
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id,
            redirect_uri,
          },
        },
        redirect,
      };
      await handleAuthorizationRequest(fns)(ctx);
      expect(getRedirectUri).toNotHaveBeenCalled();
      expect(isRedirectUriValid).toHaveBeenCalledWith({ client_id, redirect_uri });
      expect(redirect).toHaveBeenCalled();
    });

    it('should not redirect if redirect URI is invalid', async () => {
      const getRedirectUri = createSpy();
      const isRedirectUriValid = createSpy().andCall(() => false);
      const client_id = uniqueId('client_');
      const redirect_uri = uniqueId('http://forabi.net/post/');
      const redirect = createSpy().andCall(url => {
        expect(url.startsWith(redirect_uri));
      });
      const fns = {
        isClientValid() {
          return true;
        },
        createAuthorizationCode() {
          return uniqueId('auth_code_');
        },
        getRedirectUri,
        isRedirectUriValid,
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id,
            redirect_uri,
          },
        },
        redirect,
      };
      const errorHandler = createSpy().andCall(error => {
        expect(error.message).toMatch(/invalid input/i);
        expect(getRedirectUri).toNotHaveBeenCalled();
        expect(isRedirectUriValid).toHaveBeenCalledWith({ client_id, redirect_uri });
        expect(redirect).toNotHaveBeenCalled();
      });
      await handleAuthorizationRequest(fns)(ctx).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
    });

    it('should redirect to fallback redirect URI if "redirect_uri" is missing', async () => {
      const redirect_uri = uniqueId('http://forabi.net/post/');
      const getRedirectUri = createSpy().andCall(() => redirect_uri);
      const redirect = createSpy();
      const client_id = uniqueId('client_');
      const fns = {
        isClientValid() {
          return true;
        },
        createAuthorizationCode() {
          return uniqueId('auth_code_');
        },
        getRedirectUri,
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id,
          },
        },
        redirect,
      };
      await handleAuthorizationRequest(fns)(ctx);
      expect(getRedirectUri).toHaveBeenCalledWith({ client_id });
      expect(redirect).toHaveBeenCalled();
    });

    it('query string must include authorization code as "code"', async () => {
      const redirect_uri = uniqueId('http://forabi.net/post/');
      const auth_code = uniqueId('auth_code_');
      const redirect = createSpy().andCall(url => {
        expect(url.startsWith(redirect_uri));
        const parsedUrl = parseUrl(url);
        const parsedQuery = parseQuery(parsedUrl.query);
        expect(parsedQuery.code).toBe(auth_code);
        expect(parsedQuery.state).toBe(undefined);
      });
      const client_id = uniqueId('client_');
      const fns = {
        isClientValid() {
          return true;
        },
        createAuthorizationCode() {
          return auth_code;
        },
        isRedirectUriValid() {
          return true;
        },
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id, redirect_uri,
          },
        },
        redirect,
      };
      await handleAuthorizationRequest(fns)(ctx);
      expect(redirect).toHaveBeenCalled();
    });

    it('should pass non-fallback redirect_uri to code generation function' +
    'so that it could be saved');

    it('query string must include exact "state" if passed', async () => {
      const redirect_uri = uniqueId('http://forabi.net/post/');
      const state = uniqueId('state_');
      const redirect = createSpy().andCall(url => {
        expect(url.startsWith(redirect_uri));
        const parsedUrl = parseUrl(url);
        const parsedQuery = parseQuery(parsedUrl.query);
        expect(parsedQuery.state).toBe(state);
      });
      const client_id = uniqueId('client_');
      const fns = {
        isClientValid() {
          return true;
        },
        createAuthorizationCode() {
          return uniqueId('auth_code_');
        },
        isRedirectUriValid() {
          return true;
        },
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id, state, redirect_uri,
          },
        },
        redirect,
      };
      await handleAuthorizationRequest(fns)(ctx);
      expect(redirect).toHaveBeenCalled();
    });

    it('should redirect on code generation failure with "error",' +
    '"error_description" and exact "state" in query string', async () => {
      const client_id = uniqueId('client_');
      const redirect_uri = uniqueId('http://forabi.net/post/');
      const state = uniqueId('state_');
      const err_msg = uniqueId('Error_');
      const createAuthorizationCode = createSpy().andThrow(new Error(err_msg));
      const redirect = createSpy().andCall(url => {
        expect(url.startsWith(redirect_uri));
        const parsedUrl = parseUrl(url);
        const parsedQuery = parseQuery(parsedUrl.query);
        expect(parsedQuery.error).toExist();
        expect(parsedQuery.error_description).toBe(err_msg);
        expect(parsedQuery.state).toBe(state);
      });
      const fns = {
        isClientValid() {
          return true;
        },
        createAuthorizationCode,
        isRedirectUriValid() {
          return true;
        },
      };
      const ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id, redirect_uri, state,
          },
        },
        redirect,
      };
      await handleAuthorizationRequest(fns)(ctx);
      expect(createAuthorizationCode).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalled();
    });
  });
  describe('Token Request hanlder', () => {
    beforeEach(function setUpTests() {
      this.ctx = {
        request: {
          body: {
            grant_type: 'authorization_code',
            client_id: uniqueId('client_'),
            client_secret: uniqueId('client_secret_'),
            code: uniqueId('code_'),
            ttl: 3600,
            scope: 'user:notifications',
            state: uniqueId('state_'),
            redirect_uri: uniqueId('http://forabi.net/post/'),
          },
        },
      };
      this.fns = {
        isAuthorizationCodeValid: createSpy(),
        isClientSecretValid: createSpy(),
        createAccessToken: createSpy(),
        isRedirectUriRequired: createSpy(),
        isRedirectUriValid: createSpy(),
      };
      this.next = createSpy();
    });

    it('requires "grant_type" of "authorization_code", otherwise calls next', async function() {
      const { fns, ctx, next } = this;
      delete ctx.request.body.grant_type;
      await handleTokenRequest(fns)(ctx, next);
      expect(next).toHaveBeenCalled();
      for (const fn of Object.keys(fns)) {
        expect(fns[fn]).toNotHaveBeenCalled();
      }
    });

    it('requires "client_id", otherwise rejects', async function() {
      const { fns, ctx, next } = this;
      delete ctx.request.body.client_id;
      const errorHandler = createSpy().andCall(e => {
        expect(e.message)
        .toMatch(/client_id/)
        .toMatch(/missing|invalid input/i);
      });
      await handleTokenRequest(fns)(ctx, next).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
      for (const fn of Object.keys(fns)) {
        expect(fns[fn]).toNotHaveBeenCalled();
      }
    });

    it('requires "redirect_uri" if it was included in the authorization request', async function() {
      const { fns, ctx, next } = this;
      delete ctx.request.body.redirect_uri;
      fns.isRedirectUriRequired = createSpy().andReturn(true);
      fns.isRedirectUriValid = createSpy().andReturn(false);
      const errorHandler = createSpy().andCall(e => {
        expect(e.message)
        .toMatch(/redirect_uri/)
        .toMatch(/missing|invalid input/i);
      });
      await handleTokenRequest(fns)(ctx, next).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
      expect(fns.isRedirectUriRequired).toHaveBeenCalled();
      expect(fns.isRedirectUriValid).toNotHaveBeenCalled();
    });

    it('shoukd call redirect URI validation function if required', async function() {
      const { fns, ctx, next } = this;
      fns.isRedirectUriRequired = createSpy().andReturn(true);
      fns.isRedirectUriValid = createSpy().andReturn(false);
      const errorHandler = createSpy().andCall(e => {
        expect(e.message)
        .toMatch(/redirect_uri/)
        .toMatch(/missing|invalid input/i);
      });
      await handleTokenRequest(fns)(ctx, next).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
      expect(fns.isRedirectUriRequired).toHaveBeenCalled();
      expect(fns.isRedirectUriValid).toHaveBeenCalled();
    });

    it('requires "client_secret", otherwise rejects', async function () {
      const { fns, ctx, next } = this;
      delete ctx.request.body.client_secret;
      const errorHandler = createSpy().andCall(e => {
        expect(e.message)
        .toMatch(/client_secret/)
        .toMatch(/missing|invalid input/i);
      });
      await handleTokenRequest(fns)(ctx, next).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
      for (const fn of Object.keys(fns)) {
        expect(fns[fn]).toNotHaveBeenCalled();
      }
    });
    it('requires "code", otherwise rejects');
    it('should call client credentials validation function');
    it('should call code validation function only after client is validated');
    it('should reject on invalid client secret');
    it('should reject on invalid authorization code');
    it('should call access token generation function if parameters are valid');
    it('should not redirect, instead sets token as response body');
  });
});
