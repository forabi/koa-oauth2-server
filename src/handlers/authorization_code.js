import { InvalidInputError,
  MissingInputError, toOAuthError } from '../errors';
import { stringify } from 'querystring';

export function handleAuthorizationRequest({
  isClientValid, createAuthorizationCode,
  isRedirectUriValid, getFallbackRedirectUri,
  isRequestedScopeValid,
}) {
  return async (ctx, next) => {
    const {
      response_type, client_id, scope, state,
      redirect_uri,
    } = ctx.request.body;
    if (response_type !== 'code') {
      return next();
    }
    if (!client_id || !String(client_id).length
      || await isClientValid({ client_id }) === false) {
      throw new InvalidInputError('client_id');
    }
    let fallback_redirect_uri = null;
    if (!!redirect_uri && String(redirect_uri).length) {
      if (await isRedirectUriValid({ client_id, redirect_uri }) === false) {
        throw new InvalidInputError('redirect_uri');
      }
    } else {
      fallback_redirect_uri = await getFallbackRedirectUri({ client_id });
    }
    let query;
    try {
      if (await isRequestedScopeValid({ client_id, scope }) === false) {
        throw new InvalidInputError('scope');
      }
      const code = await createAuthorizationCode({
        client_id, scope, state, redirect_uri,
      });
      query = { code };
      if (state) query.state = state;
    } catch (e) {
      query = toOAuthError(e).toJSON({ state });
    } finally {
      ctx.redirect(`${redirect_uri || fallback_redirect_uri}?${stringify(query)}`);
    }
  };
}

export function handleTokenRequest({
  isClientSecretValid, createAccessToken,
  findAuthorizationCode, isRedirectUriRequired,
  isRedirectUriValid,
}) {
  return async (ctx, next) => {
    const {
      grant_type, client_id, client_secret,
      code, redirect_uri,
    } = ctx.request.body;
    if (grant_type !== 'authorization_code') {
      return next();
    }
    if (!client_id || !String(client_id).length) {
      throw new MissingInputError('client_id');
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
    const validCode = await findAuthorizationCode({ client_id, code });
    if (!validCode) throw new InvalidInputError('code');
    const scope = validCode.scope || null;
    if (await isRedirectUriRequired({ client_id, code })) {
      if (!redirect_uri || !String(redirect_uri).length
        || await isRedirectUriValid({ client_id, code }) === false) {
        throw new InvalidInputError('redirect_uri');
      }
    }
    const token = await createAccessToken({
      client_id, scope,
      createRefreshToken: true,
    });
    ctx.body = token;
  };
}
