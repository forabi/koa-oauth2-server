import { MODEL } from '../constants';
import { toOAuthError } from '../errors';
import { stringify } from 'querystring';

export async function handleTokenRequest({ createAccessToken }) {
  return (ctx, next) => {
    const {
      response_type, client_id, redirect_uri,
      scope, ttl, state,
    } = ctx.request.body;
    if (response_type !== 'token') {
      return next();
    }
    let query;
    try {
      const token = await createAccessToken({
        client_id, scope, state, ttl,
        createRefreshToken: true,
      });
      query = token;
    } catch (e) {
      query = toOAuthError(e, { state });
    } finally {
      ctx.redirect(`${redirect_uri}?${stringify(query)}`);
    }
  }
}
