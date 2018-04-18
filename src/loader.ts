import * as fs from 'fs';
import * as Router from 'koa-router';
import { BaseContext } from 'koa';
import * as Koa from 'koa';
import { bp } from './blueprint';

// 面向过程
// const route = new Router;

// export function loader() {
//   const dirs = fs.readdirSync(__dirname + '/router');

//   console.log(dirs);

//   dirs.forEach((filename) => {
//     const mod = require(__dirname + '/router/' + filename).default;

//     Object.keys(mod).map(key => {
//       const [method, path] = key.split(' ');
//       const  handler = mod[key];
//       (<any>route)[method](path, handler);
//     });
//   })

//   return route.routes();
// }


// OO
export class Loader {

  router: Router = new Router;
  controller: any = {};
  app: Koa;

  constructor(app: Koa) {
    this.app = app;
  }

  loadController() {
    const dirs = fs.readdirSync(__dirname + '/controller');
    dirs.forEach(filename => {
      require(__dirname + '/controller/' + filename).default;
      // const property = filename.split('.')[0];
      // const mod = require(__dirname + '/controller/' + filename).default;
      // if (mod) {
      //   const methodNames = Object.getOwnPropertyNames(mod.prototype).filter(names => {
      //     if (names !== 'constructor') {
      //       return names;
      //     }
      //   });

      //   Object.defineProperty(this.controller, property, {
      //     get() {
      //       const merge: { [key: string] : any } = {};
      //       methodNames.forEach(name => {
      //         merge[name] = {
      //           type: mod,
      //           methodName: name
      //         }
      //       })
      //       return merge;
      //     }
      //   })
      // }
    })
  }

  loadRouter() {
    // 挂载controller
    this.loadController();
    // 挂载service
    this.loadService();
    // 挂载config
    this.loadConfig();

    // 装饰器
    const r = bp.getRoute();
    console.log(r);
    Object.keys(r).forEach(url => {
      r[url].forEach(object => {
        (<any>this.router)[object.httpMethod](url, async (ctx: BaseContext) => {
          const instance = new object.constructor(ctx, this.app);
          await instance[object.handler]();
        })
      })
    })
    // 中心化路由
    // const mod = require(__dirname + '/router');
    // const routers = mod(this.controller);
    // // 遍历routers
    // Object.keys(routers).forEach(key => {
    //   const [method, path] = key.split(' ');
    //   (<any>this.router)[method](path, async (ctx: BaseContext) => {
    //     const _class = routers[key].type;
    //     const handler = routers[key].methodName;
    //     const instance = new _class(ctx, this.app);
    //     instance[handler]();
    //   })
    // })
    // 挂载routers
    return this.router.routes();
  }

  loadService() {
    const that = this;
    const service = fs.readdirSync(__dirname + '/service');
    Object.defineProperty(this.app.context, 'service', {
      get() {
        if(!(<any>this)['cache']) {
          (<any>this)['cache']= {};
        }
        const loaded = (<any>this)['cache'];

        if(!loaded['service']) {
          loaded['service'] = {};
          service.forEach(d => {
            const name = d.split('.')[0];
            const mod = require(__dirname + '/service/' + d);
            loaded['service'][name] = new mod(this, that.app);
          })
          return loaded.service;
        }
        return loaded.service;
      }
    })
  }

  loadConfig() {
    const configDef = __dirname + '/config/config.default.js';
    const configEnv = __dirname + (process.env.NODE_ENV === 'production' ? '/config/config.pro.js' : '/config/config.dev.js');
    const conf = require(configEnv);
    const confDef = require(configDef);
    const merge = Object.assign({}, conf, confDef);
    Object.defineProperty(this.app, 'config', {
        get: () => {
            return merge
        }
    })
  }
}