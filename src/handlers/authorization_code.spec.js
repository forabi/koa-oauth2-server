/* eslint-disable func-names */
import expect, { createSpy } from 'expect';
import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';
import { handleAuthorizationRequest, handleTokenRequest } from './authorization_code';
import uniqueId from 'lodash.uniqueid';

describe('Authorization Code Grant Type', () => {
  describe('Authorization Request handler', () => {
    beforeEach(function setUpTest() {
      this.ctx = {
        request: {
          body: {
            response_type: 'code',
            client_id: uniqueId('client_'),
            redirect_uri: uniqueId('http://forabi.net/post/'),
            scope: uniqueId('scope_'),
            state: uniqueId('state_'),
          },
        },
        redirect: createSpy(),
      };
      this.fns = {
        isClientValid: createSpy().andReturn(true),
        createAuthorizationCode: createSpy().andReturn(uniqueId('code_')),
        isRedirectUriValid: createSpy().andReturn(true),
        getFallbackRedirectUri: createSpy(),
      };
      this.next = createSpy();
    });

    it('requires "response_type" of "code", otherwise calls next', async function() {
      const { ctx, next, fns } = this;
      delete ctx.request.body.response_type;
      await handleAuthorizationRequest(fns)(ctx, next);
      for (const fn of Object.keys(fns)) {
        expect(fns[fn]).toNotHaveBeenCalled();
      }
      expect(next).toHaveBeenCalled();
    });

    it('requires "client_id", otherwise rejects', async function() {
      const { ctx, next, fns } = this;
      delete ctx.request.body.client_id;
      const errorHandler = createSpy().andCall(e => {
        expect(e.message).toMatch(/invalid input/i);
      });
      await handleAuthorizationRequest(fns)(ctx).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      for (const fn of Object.keys(fns)) {
        expect(fns[fn]).toNotHaveBeenCalled();
      }
      expect(next).toNotHaveBeenCalled();
    });

    describe('On valid requests', () => {
      beforeEach(async function () {
        const { ctx, next, fns } = this;
        await handleAuthorizationRequest(fns)(ctx);
        expect(next).toNotHaveBeenCalled();
        expect(ctx.redirect).toHaveBeenCalled();
      });
      it('should call client validation function', function () {
        const { ctx, fns } = this;
        const { client_id } = ctx.request.body;
        expect(fns.isClientValid).toHaveBeenCalledWith({ client_id });
      });
      it('should call scope validation function');
      it('should call authorization code generation function');
      it('should pass scope, state, non-fallback redirect_uri to code generation' +
    'function so that they could be saved');
      it('should redirect to passed URI if it is valid', function () {
        const { ctx, fns } = this;
        const { client_id, redirect_uri } = ctx.request.body;
        expect(fns.isRedirectUriValid)
          .toHaveBeenCalledWith({ client_id, redirect_uri });
        expect(fns.getFallbackRedirectUri).toNotHaveBeenCalled();
        expect(ctx.redirect).toHaveBeenCalled();
      });
      it('query string must include authorization code as "code"');
      it('query string must include exact "state" if passed');
      it('should redirect on code generation failure with "error", ' +
    '"error_description" and exact "state" in query string');
    });

    it('should redirect to fallback redirect URI if "redirect_uri" ' +
    'is missing', async function() {
      const { ctx, next, fns } = this;
      const fallback_redirect_uri = uniqueId('http://forabi.net/fallback/');
      fns.getFallbackRedirectUri = createSpy().andReturn(fallback_redirect_uri);
      ctx.redirect = createSpy().andCall(url => {
        expect(url.startsWith(fallback_redirect_uri));
      });
      delete ctx.request.body.redirect_uri;
      await handleAuthorizationRequest(fns)(ctx);
      expect(ctx.redirect).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
    });

    it('should not redirect if client is invalid', async function () {
      const { ctx, next, fns } = this;
      fns.isClientValid = createSpy().andCall(() => false);
      const { client_id } = ctx.request.body;
      const errorHandler = createSpy().andCall(error => {
        expect(error.message).toMatch(/invalid.+client/i);
      });
      await handleAuthorizationRequest(fns)(ctx).catch(errorHandler);
      expect(fns.isClientValid).toHaveBeenCalledWith({ client_id });
      expect(next).toNotHaveBeenCalled();
      expect(ctx.redirect).toNotHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalled();
    });

    it('should not redirect if redirect URI is invalid', async function() {
      const { ctx, next, fns } = this;
      fns.isRedirectUriValid = createSpy().andCall(() => false);
      const errorHandler = createSpy().andCall(error => {
        expect(error.message).toMatch(/invalid input/i);
      });
      await handleAuthorizationRequest(fns)(ctx).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
      expect(fns.getFallbackRedirectUri).toNotHaveBeenCalled();
      expect(fns.isRedirectUriValid).toHaveBeenCalled();
      expect(ctx.redirect).toNotHaveBeenCalled();
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
            scope: uniqueId('scope_'),
            state: uniqueId('state_'),
            redirect_uri: uniqueId('http://forabi.net/post/'),
          },
        },
      };
      this.fns = {
        findAthorizationCode: createSpy(),
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
