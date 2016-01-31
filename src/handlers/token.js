import { MODEL } from '../constants';
import { toOAuthError } from '../errors';
import { stringify } from 'querystring';

export async function handleTokenRequest(ctx, next) {
  const {
    response_type, client_id, redirect_uri,
    scope, ttl, state,
  } = ctx.request.body;
  if (response_type !== 'token') {
    return next();
  }
  const { createAccessToken } = ctx[MODEL];
  let query;
  try {
    const token = await createAccessToken({
      client_id, scope, state, ttl,
      createRefreshToken: true,
    });
    query = stringify(token);
  } catch (e) {
    query = stringify(toOAuthError(e, { state }));
  } finally {
    ctx.redirect(`${redirect_uri}?${query}`);
  }
}
