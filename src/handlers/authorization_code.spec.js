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
        getFallbackRedirectUri: createSpy().andReturn(uniqueId('http://forabi.net/fallback')),
        isRequestedScopeValid: createSpy().andReturn(true),
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
      await handleAuthorizationRequest(fns)(ctx, next).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      for (const fn of Object.keys(fns)) {
        expect(fns[fn]).toNotHaveBeenCalled();
      }
      expect(next).toNotHaveBeenCalled();
    });

    describe('On valid requests', () => {
      beforeEach(async function () {
        const { ctx, next, fns } = this;
        await handleAuthorizationRequest(fns)(ctx, next);
        expect(next).toNotHaveBeenCalled();
        expect(ctx.redirect).toHaveBeenCalled();
      });
      it('should call client validation function', function () {
        const { ctx, fns } = this;
        const { client_id } = ctx.request.body;
        expect(fns.isClientValid).toHaveBeenCalledWith({ client_id });
      });
      it('should call scope validation function', function () {
        const { ctx, fns } = this;
        const { client_id, scope } = ctx.request.body;
        expect(fns.isRequestedScopeValid)
          .toHaveBeenCalledWith({ client_id, scope });
      });
      it('should call authorization code generation function with scope, state, ' +
      'non-fallback redirect_uri so that they could be saved', function () {
        const { ctx, fns } = this;
        const { client_id, scope, state, redirect_uri } = ctx.request.body;
        expect(fns.createAuthorizationCode)
        .toHaveBeenCalledWith({ client_id, scope, state, redirect_uri });
      });
      it('should redirect to passed URI if it is valid', function () {
        const { ctx, fns } = this;
        const { client_id, redirect_uri } = ctx.request.body;
        expect(fns.isRedirectUriValid)
          .toHaveBeenCalledWith({ client_id, redirect_uri });
        expect(fns.getFallbackRedirectUri).toNotHaveBeenCalled();
        expect(ctx.redirect).toHaveBeenCalled();
      });
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
      await handleAuthorizationRequest(fns)(ctx, next);
      expect(ctx.redirect).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
    });

    it('should not redirect if client is invalid', async function () {
      const { ctx, next, fns } = this;
      fns.isClientValid = createSpy().andReturn(false);
      const { client_id } = ctx.request.body;
      const errorHandler = createSpy().andCall(error => {
        expect(error.message).toMatch(/invalid.+client/i);
      });
      await handleAuthorizationRequest(fns)(ctx, next).catch(errorHandler);
      expect(fns.isClientValid).toHaveBeenCalledWith({ client_id });
      expect(next).toNotHaveBeenCalled();
      expect(ctx.redirect).toNotHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalled();
    });

    it('should not redirect if redirect URI is invalid', async function() {
      const { ctx, next, fns } = this;
      fns.isRedirectUriValid = createSpy().andReturn(false);
      const errorHandler = createSpy().andCall(error => {
        expect(error.message).toMatch(/invalid input/i);
      });
      await handleAuthorizationRequest(fns)(ctx, next).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
      expect(fns.getFallbackRedirectUri).toNotHaveBeenCalled();
      expect(fns.isRedirectUriValid).toHaveBeenCalled();
      expect(ctx.redirect).toNotHaveBeenCalled();
    });

    it('query string must include "code" and "state"', async function() {
      const { ctx, next, fns } = this;
      const { redirect_uri, state } = ctx.request.body;
      const code = uniqueId('auth_code_');
      fns.createAuthorizationCode = createSpy().andReturn(code);
      ctx.redirect = createSpy().andCall(url => {
        expect(url.startsWith(redirect_uri));
        const parsedUrl = parseUrl(url);
        const parsedQuery = parseQuery(parsedUrl.query);
        expect(parsedQuery.code).toBe(code);
        expect(parsedQuery.state).toBe(state);
      });
      await handleAuthorizationRequest(fns)(ctx, next);
      expect(next).toNotHaveBeenCalled();
      expect(ctx.redirect).toHaveBeenCalled();
    });

    it('should redirect with error if scope is invalid', async function() {
      const { ctx, next, fns } = this;
      const { state, redirect_uri } = ctx.request.body;
      fns.isRequestedScopeValid = createSpy().andReturn(false);
      ctx.redirect = createSpy().andCall(url => {
        expect(url.startsWith(redirect_uri));
        const parsedUrl = parseUrl(url);
        const parsedQuery = parseQuery(parsedUrl.query);
        expect(parsedQuery.error).toExist();
        expect(parsedQuery.error_description).toMatch(/scope/i);
        expect(parsedQuery.state).toBe(state);
      });
      await handleAuthorizationRequest(fns)(ctx, next);
      expect(next).toNotHaveBeenCalled();
      expect(fns.createAuthorizationCode).toNotHaveBeenCalled();
      expect(ctx.redirect).toHaveBeenCalled();
    });

    it('should redirect on code generation failure with "error", ' +
    '"error_description" and exact "state" in query string', async function() {
      const { ctx, next, fns } = this;
      const { state, redirect_uri } = ctx.request.body;
      const err_msg = uniqueId('Error_');
      fns.createAuthorizationCode = createSpy().andThrow(new Error(err_msg));
      ctx.redirect = createSpy().andCall(url => {
        expect(url.startsWith(redirect_uri));
        const parsedUrl = parseUrl(url);
        const parsedQuery = parseQuery(parsedUrl.query);
        expect(parsedQuery.error).toExist();
        expect(parsedQuery.error_description).toBe(err_msg);
        expect(parsedQuery.state).toBe(state);
      });
      await handleAuthorizationRequest(fns)(ctx, next);
      expect(next).toNotHaveBeenCalled();
      expect(fns.createAuthorizationCode).toHaveBeenCalled();
      expect(ctx.redirect).toHaveBeenCalled();
    });
  });

  describe('Token Request hanlder', () => {
    beforeEach(function setUpTest() {
      const code = uniqueId('code_');
      const scope = uniqueId('scope_');
      this.ctx = {
        request: {
          body: {
            grant_type: 'authorization_code',
            client_id: uniqueId('client_'),
            client_secret: uniqueId('client_secret_'),
            code,
            scope,
            state: uniqueId('state_'),
            redirect_uri: uniqueId('http://forabi.net/post/'),
          },
        },
      };
      this.fns = {
        findAuthorizationCode: createSpy().andReturn({ code, scope }),
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

    it('should call redirect URI validation function if required', async function() {
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

    describe('Required Parameters', () => {
      function testRequiredParam(param) {
        return async function() {
          const { fns, ctx, next } = this;
          delete ctx.request.body[param];
          const errorHandler = createSpy().andCall(e => {
            expect(e.message)
            .toMatch(new RegExp(`${param}`))
            .toMatch(/missing|invalid input/i);
          });
          await handleTokenRequest(fns)(ctx, next).catch(errorHandler);
          expect(errorHandler).toHaveBeenCalled();
          expect(next).toNotHaveBeenCalled();
          for (const fn of Object.keys(fns)) {
            expect(fns[fn]).toNotHaveBeenCalled();
          }
        };
      }
      for (const param of ['client_id', 'client_secret', 'code']) {
        it(`requires "${param}", otherwise rejects`, testRequiredParam(param));
      }
    });

    it('should call client credentials validation function', async function() {
      const { fns, ctx, next } = this;
      const { client_id, client_secret } = ctx.request.body;
      await handleTokenRequest(fns)(ctx, next);
      expect(next).toNotHaveBeenCalled();
      expect(fns.isClientSecretValid).toHaveBeenCalledWith({ client_id, client_secret });
    });
    it('should reject on invalid client secret', async function() {
      const { fns, ctx, next } = this;
      fns.isClientSecretValid = createSpy().andReturn(false);
      const errorHandler = createSpy().andCall(e => {
        expect(e.message)
          .toMatch(/client_secret/)
          .toMatch(/missing|invalid input/i);
      });
      await handleTokenRequest(fns)(ctx, next).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
    });
    it('should reject on invalid authorization code', async function() {
      const { fns, ctx, next } = this;
      fns.findAuthorizationCode = createSpy().andReturn(null);
      const errorHandler = createSpy().andCall(e => {
        expect(e.message)
          .toMatch(/code/)
          .toMatch(/missing|invalid input/i);
      });
      await handleTokenRequest(fns)(ctx, next).catch(errorHandler);
      expect(errorHandler).toHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
    });
    describe('On valid request', () => {
      beforeEach(async function setUpTest() {
        const { fns, ctx, next } = this;
        await handleTokenRequest(fns)(ctx, next);
        expect(next).toNotHaveBeenCalled();
      });
      it('should call code validation function only after client ' +
      'secret is validated', async function() {
        const { fns, ctx } = this;
        const { client_id, client_secret, code } = ctx.request.body;
        expect(fns.isClientSecretValid).toHaveBeenCalledWith({ client_id, client_secret });
        expect(fns.findAuthorizationCode).toHaveBeenCalledWith({ client_id, code });
      });
      it('should call access token generation function if parameters are valid', async function() {
        expect(this.fns.createAccessToken).toHaveBeenCalled();
      });
    });
    it('should not redirect, instead sets token as response body', async function() {
      const { fns, ctx, next } = this;
      const token = { token: uniqueId('token_') };
      fns.createAccessToken = createSpy().andReturn(token);
      ctx.redirect = createSpy();
      await handleTokenRequest(fns)(ctx, next);
      expect(fns.createAccessToken).toHaveBeenCalled();
      expect(ctx.body).toBe(token);
      expect(ctx.redirect).toNotHaveBeenCalled();
      expect(next).toNotHaveBeenCalled();
    });
  });
});
