interface Bp {
  httpMethod: string,
  constructor: any,
  handler: string
}

interface Bps {
  [key: string]: Array<Bp>
}

export class BluePrint {
  router: Bps = {};

  setRouter(url: string, blueprint: Bp) {
    const _bp = this.router[url];
    if (_bp) {
      for(const i in _bp) {
        const object = _bp[i];

        if (object.httpMethod === blueprint.httpMethod) {
          console.log(`路由地址 ${object.httpMethod} ${url} 已经存在`)
          return;
        }
      }
      this.router[url].push(blueprint);
    } else {
      this.router[url] = [];
      this.router[url].push(blueprint);      
    }
  }

  /**
     * 用法@instance.get('/')
     * @param url 
     */
  get(url: string) {
    return (target: any, propertyKey: string) => {
        console.log('ddd', target, propertyKey);
        (<any>this).setRouter(url, {
            httpMethod: 'get',
            constructor: target.constructor,
            handler: propertyKey
        })
    }
  }

  getRoute() {
    return this.router;
  }
}


export const bp = new BluePrint;