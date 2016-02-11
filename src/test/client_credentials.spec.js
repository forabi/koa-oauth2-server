/* eslint-disable func-names */
import expect, { createSpy } from 'expect';
import { handleTokenRequest } from '../handlers/client_credentials';
import { testRequiredParam } from './_test_helper';
import uniqueId from 'lodash.uniqueid';

describe('Client Credentials Grant Type', () => {
  describe('Token Request handler', () => {
    beforeEach(function setUpTest() {
      this.token = { token: uniqueId('token_') };
      this.ctx = {
        request: {
          body: {
            grant_type: 'client_credentials',
            client_id: uniqueId('client_'),
            client_secret: uniqueId('client_secret_'),
            scope: uniqueId('scope_'),
          },
        },
        redirect: createSpy(),
      };
      this.fns = {
        createAccessToken: createSpy().andReturn(this.token),
        areClientCredentialsValid: createSpy().andReturn(true),
        isRequestedScopeValid: createSpy().andReturn(true),
      };
      this.next = createSpy();
    });
    it('requires "grant_type" of "client_credentials", otherwise calls next', async function() {
      const { fns, ctx, next } = this;
      delete ctx.request.body.grant_type;
      await handleTokenRequest(fns)(ctx, next);
      expect(next).toHaveBeenCalled();
      for (const fn of Object.keys(fns)) {
        expect(fns[fn]).toNotHaveBeenCalled();
      }
    });

    describe('Required Parameters', () => {
      for (const param of ['client_id', 'client_secret']) {
        it(`requires "${param}", otherwise rejects`,
          testRequiredParam(param, handleTokenRequest));
      }
    });

    it('does not require scope', async function() {
      const { ctx, next, fns } = this;
      delete ctx.request.body.scope;
      const token = { token: uniqueId('token_') };
      fns.createAccessToken = createSpy().andReturn(token);
      await handleTokenRequest(fns)(ctx, next);
      expect(fns.createAccessToken).toHaveBeenCalled();
      expect(ctx.body).toBe(token);
    });

    describe('Invalid parameters', () => {
      it('should reject on invalid "client_id" and/or "client_secret"', function () {
        this.fns.areClientCredentialsValid = createSpy().andReturn(false);
        this.errorHandler = createSpy().andCall(e => {
          expect(e.message)
          .toMatch(/client_id|client_secret/)
          .toMatch(/missing|invalid input/i);
        });
      });

      it('should reject on invalid "scope"', function () {
        this.fns.isRequestedScopeValid = createSpy().andReturn(false);
        this.errorHandler = createSpy().andCall(e => {
          expect(e.message)
          .toMatch(/scope/)
          .toMatch(/missing|invalid input/i);
        });
      });

      afterEach(async function() {
        const { fns, ctx, next, errorHandler } = this;
        await handleTokenRequest(fns)(ctx, next).catch(errorHandler);
        expect(errorHandler).toHaveBeenCalled();
      });
    });

    it('should set a server error as response body', async function() {
      const { ctx, next, fns } = this;
      const errorMessage = uniqueId('Error_');
      fns.createAccessToken = createSpy().andThrow(new Error(errorMessage));
      await handleTokenRequest(fns)(ctx, next);
      expect(next).toNotHaveBeenCalled();
      expect(ctx.body.error).toExist();
      expect(ctx.body.error_description).toContain(errorMessage);
    });
    describe('On valid requests', () => {
      beforeEach(async function setUpTest() {
        const { ctx, next, fns } = this;
        await handleTokenRequest(fns)(ctx, next);
        expect(next).toNotHaveBeenCalled();
        expect(ctx.redirect).toNotHaveBeenCalled();
      });
      it('if scope is included, it should be validated', function () {
        const { ctx, fns } = this;
        const { client_id, scope } = ctx.request.body;
        expect(fns.isRequestedScopeValid)
          .toHaveBeenCalledWith({ client_id, scope });
      });
      it('token generation function should be called with all parameters', function () {
        const { ctx, fns } = this;
        const { client_id, scope } = ctx.request.body;
        expect(fns.createAccessToken)
          .toHaveBeenCalledWith({ client_id, scope, createRefreshToken: false });
      });
      it('should validate client credentials', function () {
        const { ctx, fns } = this;
        const { client_id, client_secret } = ctx.request.body;
        expect(fns.areClientCredentialsValid)
          .toHaveBeenCalledWith({ client_id, client_secret });
      });
      it('should not redirect, instead sets the token as response body', function () {
        expect(this.ctx.redirect).toNotHaveBeenCalled();
        expect(this.ctx.body).toEqual(this.token);
      });
      it('response should not include a refresh token', function () {
        expect(this.ctx.body.token.refresh_token).toNotExist();
      });
    });
  });
});
