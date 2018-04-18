import * as Koa from 'koa';
import { Loader } from './loader';

const app = new Koa();

const loader = new Loader(app);

app.use(loader.loadRouter());

app.listen(3600, () => {
  console.log('server is already start in http://localhost:3600');
});