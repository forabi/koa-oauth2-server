import { MissingInputError } from '../errors';

export async function handleTokenRequest({ createAccessToken }) {
  return (ctx, next) => {
    const {
      grant_type, username, password, scope,
      client_id, state, ttl,
    } = ctx.request.body;
    if (grant_type !== 'password') {
      return next();
    }
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
}
