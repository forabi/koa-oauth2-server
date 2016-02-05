import { InvalidInputError, toOAuthError } from '../errors';

export function handleTokenRequest({
  createAccessToken, areClientCredentialsValid,
  isRequestedScopeValid,
}) {
  return async (ctx, next) => {
    const {
      grant_type, client_id, client_secret,
      scope,
    } = ctx.request.body;
    if (grant_type !== 'client_credentials') {
      return next();
    }
    if (!client_id || !String(client_id).length) {
      throw new InvalidInputError('client_id');
    }
    if (!client_secret || !String(client_secret).length) {
      throw new InvalidInputError('client_secret');
    }
    if (await areClientCredentialsValid({ client_id, client_secret }) === false) {
      throw new InvalidInputError('client_secret');
    }
    if (scope && await isRequestedScopeValid({ client_id, scope }) === false) {
      throw new InvalidInputError('scope');
    }
    try {
      const token = await createAccessToken({
        client_id, scope,
        createRefreshToken: false,
      });
      ctx.body = token;
    } catch (e) {
      ctx.body = toOAuthError(e).toJSON();
    }
  };
}
