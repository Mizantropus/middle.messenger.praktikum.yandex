import { expect } from "chai";
import { stub } from "sinon";
import { HTTPTransport, fetchWithRetry, METHODS, queryStringify } from "./ajax";

describe("HTTPTransport", () => {
  let xhrStub: any;
  let transport: HTTPTransport;

  beforeEach(() => {
    xhrStub = {
      open: stub(),
      setRequestHeader: stub(),
      send: stub(),
      onload: null,
      onerror: null,
      ontimeout: null,
      timeout: 0,
      withCredentials: false,
      status: 200,
      responseText: '{"ok": true}'
    };
    (global as any).XMLHttpRequest = stub().returns(xhrStub);
    transport = new HTTPTransport();
  });

  afterEach(() => {
    delete (global as any).XMLHttpRequest;
  });

  it("Отправка GET запроса", async () => {
    const promise = transport.get("/test");
    xhrStub.onload();
    const result = await promise;
    expect(xhrStub.open.calledWith("GET", "/test")).to.be.true;
    expect(xhrStub.send.calledOnce).to.be.true;
    expect(result).to.equal(xhrStub);
  });

  it("Отправка POST запроса с данными", async () => {
    const promise = transport.post("/test", { data: { key: "value" } });
    xhrStub.onload();
    const result = await promise;
    expect(xhrStub.open.calledWith("POST", "/test")).to.be.true;
    expect(xhrStub.setRequestHeader.calledWith("Content-Type", "application/json")).to.be.true;
    expect(xhrStub.send.calledWith(JSON.stringify({ key: "value" }))).to.be.true;
    expect(result).to.equal(xhrStub);
  });

  it("Обработка ошибки запроса", async () => {
    const promise = transport.get("/test");
    xhrStub.onerror();
    try {
      await promise;
      expect.fail("Должен был выбросить ошибку");
    } catch (error) {
      expect((error as Error).message).to.equal("Ошибка запроса");
    }
  });

  it("Обработка таймаута", async () => {
    const promise = transport.get("/test");
    xhrStub.ontimeout();
    try {
      await promise;
      expect.fail("Должен был выбросить ошибку");
    } catch (error) {
      expect((error as Error).message).to.equal("Превышено время ожидания");
    }
  });
});

describe("queryStringify", () => {
  it("Сериализация пустого объекта", () => {
    const result = queryStringify();
    expect(result).to.equal("");
  });

  it("Сериализация объекта с данными", () => {
    const result = queryStringify({ key: "value", num: 123 });
    expect(result).to.equal("?key=value&num=123");
  });
});

describe("fetchWithRetry", () => {
  let transportStub: any;
  let mockXhr: any;

  beforeEach(() => {
    mockXhr = { status: 200 };
    transportStub = stub(HTTPTransport.prototype, "get").resolves(mockXhr);
  });

  afterEach(() => {
    transportStub.restore();
  });

  it("Успешный запрос с первой попытки", async () => {
    const result = await fetchWithRetry("/test", METHODS.GET, {});
    expect(transportStub.calledOnce).to.be.true;
    expect(result.status).to.equal(200);
  });

  it("Повторная попытка при ошибке", async () => {
    transportStub.onFirstCall().rejects(new Error("Ошибка"));
    transportStub.onSecondCall().resolves(mockXhr);

    const result = await fetchWithRetry("/test", METHODS.GET, {}, 3);
    expect(transportStub.calledTwice).to.be.true;
    expect(result.status).to.equal(200);
  });
});
