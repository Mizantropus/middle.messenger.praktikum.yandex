import Route from "./route";
import { Block } from "./block";
import { SimpleCookie } from "./cookies";

const SIGN_IN_PATH = "/sign-in";
const CHATS_PATH = "/chats";
const PATHNAMES_REDIRECTED = ["/sign-in", "/sign-up"];

type BlockFactory = () => Promise<Block>;

export default class Router {
  private static __instance: Router;
  private routes: { pathname: string, blockFactory: BlockFactory, need_auth: boolean }[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery: string = "";

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  use(pathname: string, blockFactory: BlockFactory, need_auth: boolean = false): this {
    this.routes.push({ pathname, blockFactory, need_auth });
    return this;
  }

  start(): void {
    window.onpopstate = (event: PopStateEvent) => {
      this._onRoute((event.currentTarget as Window).location.pathname);
    };
    this._onRoute(window.location.pathname);
  }

  private async _onRoute(pathname: string): Promise<void> {
    let routeConfig = this.getRouteConfig(pathname);

    if (!routeConfig) return;

    let simpleCookie = new SimpleCookie();
    let is_auth = simpleCookie.get("is_auth");

    if (routeConfig.need_auth && !is_auth) {
      routeConfig = this.getRouteConfig(SIGN_IN_PATH);
      if (!routeConfig) return;
    } else if (is_auth && PATHNAMES_REDIRECTED.includes(pathname)) {
      routeConfig = this.getRouteConfig(CHATS_PATH);
      if (!routeConfig) return;
    }
    if (this._currentRoute) {
      this._currentRoute.leave();
    }
    const block = await routeConfig.blockFactory();
    this._currentRoute = new Route(routeConfig.pathname, block, { rootQuery: this._rootQuery }, routeConfig.need_auth);
    this._currentRoute.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  back(): void {
    window.history.back();
  }

  forward(): void {
    window.history.forward();
  }

  getRouteConfig(pathname: string) {
    return this.routes.find(route => route.pathname === pathname);
  }
}
