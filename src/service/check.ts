import { BaseContext } from "koa";
import * as koa from 'koa';

class Service {
  ctx: BaseContext;
  app: koa;
  constructor(ctx: BaseContext, app: koa) {
    this.ctx = ctx;
    this.app = app;
  }
}

class check extends Service {
  index() {
    return 2 + 3;
  }
}

module.exports = check;