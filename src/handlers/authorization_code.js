import { InvalidInputError,
  MissingInputError, toOAuthError } from '../errors';
import { stringify } from 'querystring';

export function handleAuthorizationRequest({ isClientValid, createAuthorizationCode, isRedirectUriValid, getRedirectUri }) {
  return async (ctx, next) => {
    const {
      response_type, client_id, scope, state,
    } = ctx.request.body;
    let { redirect_uri } = ctx.request.body;
    if (response_type !== 'code') {
      return next();
    }
    if (!client_id || !String(client_id).length
      || await isClientValid({ client_id }) === false) {
      throw new InvalidInputError('client_id');
    }
    if (!!redirect_uri && redirect_uri.length) {
      if (await isRedirectUriValid({ client_id, redirect_uri }) === false) {
        throw new InvalidInputError('redirect_uri');
      }
    } else {
      redirect_uri = await getRedirectUri({ client_id });
    }
    let query;
    try {
      const code = await createAuthorizationCode({
        client_id, scope, state, redirect_uri,
      });
      query = { code };
      if (state) query.state = state;
    } catch (e) {
      query = toOAuthError(e, state);
    } finally {
      ctx.redirect(`${redirect_uri}?${stringify(query)}`);
    }
  }
}

export function handleTokenRequest({ isClientSecretValid, createAccessToken, isAuthorizationCodeValid }) {
  return async (ctx, next) => {
    const {
      grant_type, client_id, client_secret,
      ttl, scope, code,
    } = ctx.request.body;
    if (grant_type !== 'authorization_code') {
      return next();
    }
    if (!code || !String(code).length) {
      throw new MissingInputError('code');
    }
    if (!client_secret || !String(client_secret).length) {
      throw new MissingInputError('client_secret');
    }
    if (await isClientSecretValid({ client_id, client_secret }) === false) {
      throw new InvalidInputError('client_secret');
    }
    if (await isAuthorizationCodeValid({ client_id, code }) === false) {
      throw new InvalidInputError('code');
    }
    const token = await createAccessToken({
      client_id, scope, ttl,
      createRefreshToken: true,
    });
    ctx.body = token;
  }
}
