import { BaseContext } from "koa";
import * as koa from 'koa';

export class Controller {
  ctx: BaseContext;
  app: koa;
  constructor(ctx: BaseContext, app: koa) {
    this.ctx = ctx;
    this.app = app;
  }
}