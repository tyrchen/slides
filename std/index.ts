declare interface RequestContext {
  qs: { [key: string]: any };
  handler?: string;
  params: { [key: string]: string };
  allow_header?: string;
}

type Handler = (req: Request, ctx: RequestContext) => Promise<Response>;

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

export { Router, App };
export type { RequestContext };
