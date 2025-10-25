import { expect } from "chai";
import { stub, spy } from "sinon";
import Router from "./router";
import { RouteAddresses } from "./routes";
import { Block } from "./block";
import { SimpleCookie } from "./cookies";

class TestBlock extends Block {
  constructor(props: Record<string, unknown> = {}) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile("", this.props);
  }
}

describe("Router", () => {
  let router: Router;
  let historyPushStateStub: any;
  let historyBackStub: any;
  let historyForwardStub: any;
  let cookieStub: any;

  beforeEach(() => {
    historyPushStateStub = stub(window.history, "pushState");
    historyBackStub = stub(window.history, "back");
    historyForwardStub = stub(window.history, "forward");
    cookieStub = stub(SimpleCookie.prototype, "get");
    router = new Router("#app");
  });

  afterEach(() => {
    historyPushStateStub.restore();
    historyBackStub.restore();
    historyForwardStub.restore();
    cookieStub.restore();
    (Router as any).__instance = null;
  });

  it("Добавление маршрута с методом use", () => {
    const blockFactory = async () => new TestBlock({});
    router.use(RouteAddresses.SignIn, blockFactory, false);
    const routeConfig = router.getRouteConfig(RouteAddresses.SignIn);
    expect(routeConfig).to.not.be.undefined;
    expect(routeConfig?.pathname).to.equal(RouteAddresses.SignIn);
    expect(routeConfig?.need_auth).to.be.false;
  });

  it("Навигация к маршруту с методом go", () => {
    const blockFactory = stub().resolves(new TestBlock({}));
    router.use(RouteAddresses.Messenger, blockFactory, false);
    router.go(RouteAddresses.Messenger);
    expect(historyPushStateStub.calledOnceWith({}, "", RouteAddresses.Messenger)).to.be.true;
    expect(blockFactory.calledOnce).to.be.true;
  });

  it("Обработка аутентификации - редирект на SignIn если требуется auth и нет куки", () => {
    const blockFactoryAuth = stub().resolves(new TestBlock({}));
    const blockFactorySignIn = stub().resolves(new TestBlock({}));
    router.use(RouteAddresses.Settings, blockFactoryAuth, true);
    router.use(RouteAddresses.SignIn, blockFactorySignIn, false);
    router.go(RouteAddresses.Settings);
    expect(blockFactorySignIn.calledOnce).to.be.true;
    expect(blockFactoryAuth.notCalled).to.be.true;
  });

  it("Обработка аутентификации - редирект на Messenger если auth и пытается зайти на SignIn", () => {
    const blockFactoryMessenger = stub().resolves(new TestBlock({}));
    const blockFactorySignIn = stub().resolves(new TestBlock({}));
    router.use(RouteAddresses.SignIn, blockFactorySignIn, false);
    router.use(RouteAddresses.Messenger, blockFactoryMessenger, false);
    cookieStub.returns("true");
    router.go(RouteAddresses.SignIn);
    expect(blockFactoryMessenger.calledOnce).to.be.true;
    expect(blockFactorySignIn.notCalled).to.be.true;
  });

  it("Метод back вызывает history.back", () => {
    router.back();
    expect(historyBackStub.calledOnce).to.be.true;
  });

  it("Метод forward вызывает history.forward", () => {
    router.forward();
    expect(historyForwardStub.calledOnce).to.be.true;
  });

  it("Метод start устанавливает обработчик popstate", () => {
    const onRouteSpy = spy(router as any, "_onRoute");
    router.start();
    expect((global as any).window.onpopstate).to.be.a("function");
    const mockEvent = { currentTarget: { location: { pathname: RouteAddresses.SignUp } } };
    (global as any).window.onpopstate(mockEvent);
    expect(onRouteSpy.calledWith(RouteAddresses.SignUp)).to.be.true;
    onRouteSpy.restore();
  });
});
