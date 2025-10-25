import { expect, use } from "chai";
import * as sinon from "sinon";
import sinonChai from "sinon-chai";
import EventBus from "./mediator";

use(sinonChai);

describe("EventBus", () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it("Инициализирует listeners с событием updated", () => {
    expect(eventBus.listeners).to.have.property("updated");
    expect(eventBus.listeners.updated).to.be.an("array").that.is.empty;
  });

  it("Добавляет слушателя к существующему событию", () => {
    const callback = sinon.stub();
    eventBus.on("updated", callback);
    expect(eventBus.listeners.updated).to.include(callback);
  });

  it("Создает новый массив слушателей для нового события", () => {
    const callback = sinon.stub();
    eventBus.on("newEvent", callback);
    expect(eventBus.listeners).to.have.property("newEvent");
    expect(eventBus.listeners.newEvent).to.include(callback);
  });

  it("Удаляет слушателя от события", () => {
    const callback = sinon.stub();
    eventBus.on("updated", callback);
    eventBus.off("updated", callback);
    expect(eventBus.listeners.updated).to.not.include(callback);
  });

  it("Бросает ошибку при попытке удалить слушателя от несуществующего события", () => {
    const callback = sinon.stub();
    expect(() => eventBus.off("nonExistent", callback)).to.throw("Нет события: nonExistent");
  });

  it("Вызывает слушателей при emit с аргументами", () => {
    const callback1 = sinon.stub();
    const callback2 = sinon.stub();
    eventBus.on("testEvent", callback1);
    eventBus.on("testEvent", callback2);
    eventBus.emit("testEvent", "arg1", "arg2");
    expect(callback1).to.have.been.calledOnceWith("arg1", "arg2");
    expect(callback2).to.have.been.calledOnceWith("arg1", "arg2");
  });

  it("Бросает ошибку при emit несуществующего события", () => {
    expect(() => eventBus.emit("nonExistent")).to.throw("Нет события: nonExistent");
  });
});
