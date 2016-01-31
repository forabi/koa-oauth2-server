import Router from 'koa-router';
import { tokenHandlers, authorizationHandlers } from './handlers';

const router = new Router();

// router.get('/authorize', async (ctx) => {

// });

router.post('/authorize', ...authorizationHandlers);

router.post('/token', ...tokenHandlers);

// router.get('/revoke', async (ctx) => {

// });

export default router;
