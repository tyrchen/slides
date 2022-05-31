type Handler = (req: Request, ctx: RequestContext) => Promise<Response>;
type ZeroCopyBuffer = Uint8Array | ArrayBuffer;
type OptionZeroCopyBuffer = ZeroCopyBuffer | null | undefined;
declare namespace Cella {
  namespace app {
    function valid(data: ZeroCopyBuffer): OptionZeroCopyBuffer;
    function publish(
      app: string,
      commit: string,
      org: string,
      data: ZeroCopyBuffer
    ): void;
    function release(
      app: string,
      commit: string,
      org: string,
      data: ZeroCopyBuffer
    ): void;
  }

  namespace ddb {
    function put(key: string, value: ZeroCopyBuffer): Promise<void>;
    function get(key: string): Promise<ZeroCopyBuffer>;
    function remove(key: string): Promise<void>;
  }

  namespace http {
    function addRoute(method: string, path: string, handler: Handler): void;
  }

  namespace rdb {
    function find(sql: string): Promise<[object]>;
    function findOne(sql: string): Promise<object>;
    function execute(sql: string): Promise<number>;
  }
}

declare interface RequestContext {
  qs: { [key: string]: any };
  handler?: string;
  params: { [key: string]: string };
  allow_header?: string;
}

const route_post = (path: string, handler: Handler) =>
  Cella.http.addRoute('POST', path, handler);
const route_get = (path: string, handler: Handler) =>
  Cella.http.addRoute('GET', path, handler);
const route_put = (path: string, handler: Handler) =>
  Cella.http.addRoute('PUT', path, handler);

const Router = {
  post: route_post,
  get: route_get,
  put: route_put,
};

const App = {
  valid: Cella.app.valid,
  publish: Cella.app.publish,
  release: Cella.app.release,
};

const DocumentDb = {
  get: Cella.ddb.get,
  put: Cella.ddb.put,
  delete: Cella.ddb.remove,
};

export type { RequestContext };
export { Router, App, DocumentDb };
