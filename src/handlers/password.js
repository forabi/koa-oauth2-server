import { MissingInputError } from '../errors';

import { MODEL } from '../constants';

export async function handleTokenRequest(ctx, next) {
  const {
    grant_type, username, password, scope,
    client_id, state, ttl,
  } = ctx.request.body;
  if (grant_type !== 'password') {
    return next();
  }
  const { createAccessToken } = ctx[MODEL];
  if (!password || !String(password).length) {
    throw new MissingInputError('password');
  }
  if (!username || !String(username).length) {
    throw new MissingInputError('username');
  }
  const token = await createAccessToken({
    client_id, scope, state, ttl,
    createRefreshToken: true,
  });
  ctx.body = token;
}
