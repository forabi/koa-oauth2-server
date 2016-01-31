import { MODEL } from '../constants';
import { MissingInputError } from '../errors';

export async function handleTokenRequest(ctx, next) {
  const {
    grant_type, client_id,
    ttl, scope, state,
    refresh_token,
  } = ctx.request.body;
  if (grant_type !== 'refresh_token') {
    return next();
  }
  const { createAccessToken } = ctx[MODEL];
  if (!refresh_token || !String(refresh_token).length) {
    throw new MissingInputError('refresh_token');
  }
  if (!client_id || !String(client_id).length) {
    throw new MissingInputError('client_id');
  }
  const token = await createAccessToken({
    client_id, scope, state, ttl,
    createRefreshToken: true,
  });
  ctx.body = token;
}