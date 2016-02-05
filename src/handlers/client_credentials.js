import { InvalidInputError } from '../errors';

export function handleTokenRequest({
  createAccessToken, isClientSecretValid,
  isRequestedScopeValid,
}) {
  return async (ctx, next) => {
    const {
      grant_type, client_id, client_secret,
      scope, ttl, state,
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
    if (await isClientSecretValid({ client_id, client_secret }) === false) {
      throw new InvalidInputError('client_secret');
    }
    const token = await createAccessToken({
      client_id, scope, state, ttl,
      createRefreshToken: true,
    });
    ctx.body = token;
  };
}
