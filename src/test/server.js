import Koa from 'koa';
import router from '../router';
import bodyParser from 'koa-bodyparser';
const server = new Koa();
server.use(bodyParser());
server.use(router.routes());
server.listen(4000);
