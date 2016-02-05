/* eslint-disable func-names */
import expect, { createSpy } from 'expect';
import { handleTokenRequest } from '../handlers/client_credentials';
import { testRequiredParam } from './_test_helper';
import uniqueId from 'lodash.uniqueid';

describe('Client Credentials Grant Type', () => {
  describe('Token Request handler', () => {
    beforeEach(function setUpTest() {
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
        createAccessToken: createSpy(),
        isClientSecretValid: createSpy(),
        isRequestedScopeValid: createSpy(),
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
          testRequiredParam(handleTokenRequest, param));
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
    it('should reject on invalid "client_id"');
    it('should reject on invalid "client_secret"');
    it('should reject on invalid "scope"');
    it('should set a server error as response body');
    describe('On valid requests', () => {
      beforeEach(async function setUpTest() {
        const { ctx, next, fns } = this;
        await handleTokenRequest(fns)(ctx, next);
        expect(next).toNotHaveBeenCalled();
        expect(ctx.redirect).toNotHaveBeenCalled();
      });
      it('if scope is included, it should be validated');
      it('if scope is valid, it should be passed to token generation function');
      it('should validate client credentials');
      it('should not redirect, instead sets the token as response body');
      it('response should not include a refresh token');
    });
  });
});
