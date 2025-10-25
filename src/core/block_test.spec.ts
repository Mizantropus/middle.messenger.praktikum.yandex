import { expect, use } from "chai";
import { stub } from "sinon";
import sinonChai from "sinon-chai";
import type { AnyProps } from "./block.js";
import { Block } from "./block.js";


class TestBlock extends Block {
  private template: string;
  constructor(elem: string, props: AnyProps, template: string = "") {
    super(elem, props);
    this.template = template;
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(this.template, this.props);
  }
}

describe("Block", () => {

  let block: Block;
  const defaultProps: [string, Record<string, unknown>] = ["div", {testProp: "value"}];
  use(sinonChai);

  beforeEach(() => {
    block = new TestBlock(...defaultProps);
  });

  it("Проверка корневого элемента в блоке", () => {
    expect(block.element.tagName).to.equal("DIV");
  });

  it("Проверка установки свойств блока", () => {
    expect(block.getProps().testProp).to.equal("value");
  });

  it("Обновление свойств блока", () => {
    block.setProps({ testProp: "newValue" });
    expect(block.getProps().testProp).to.equal("newValue");
  });

  it("Скрытие и показ блока", () => {
    block.hide();
    expect(block.element.style.display).to.equal("none");
    block.show();
    expect(block.element.style.display).to.equal("block");
  });

  it("Обновление потомка", () => {
    block.setProps({ child: new TestBlock(...defaultProps) });
    const newChild = new TestBlock("div", {});
    expect(() => block.updateChildren("child", newChild)).to.not.throw();
  });

  it("Обновление списка потомков", () => {
    block.setProps({ list: [new TestBlock(...defaultProps)] });
    const newList = [new TestBlock(...defaultProps), new TestBlock(...defaultProps)];
    expect(() => block.updateChildrenList(newList)).to.not.throw();
  });

  it("Вызов события в блоке", async () => {
    const testHandleEvent = stub();
    let new_block = new TestBlock("div", { testProp: "value" });
    new_block.setProps({
      events: {
        click: testHandleEvent,
      }
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    const testEvent = new MouseEvent("click");
    new_block.getContent()?.dispatchEvent(testEvent);
    expect(testHandleEvent.calledOnce).to.be.true;
  });

  it("Вызов обновлённого события в блоке", async () => {
    const testHandleEvent = stub();
    block.setProps({
      testProp: "new_value",
      events: {
        click: testHandleEvent,
      }
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    const testEvent = new MouseEvent("click");
    block.getContent()?.dispatchEvent(testEvent);
    expect(testHandleEvent.calledOnce).to.be.true;
  });

  it("Компиляция простого шаблона", async () => {
    const testBlock = new TestBlock("div", { name: "Test" }, "<div>{{name}}</div>");
    const fragment = await testBlock.render();
    expect(fragment.textContent?.trim()).to.equal("Test");
  });

  it("Компиляция шаблона с условным оператором", async () => {
    const testBlock = new TestBlock("div", { show: true }, "{{#if show}}Hello{{/if}}");
    const fragment = await testBlock.render();
    expect(fragment.textContent?.trim()).to.equal("Hello");
  });

  it("Компиляция шаблона с циклом", async () => {
    const testBlock = new TestBlock("div", { items: ["a", "b"] }, "{{#each items}}<span>{{this}}</span>{{/each}}");
    const fragment = await testBlock.render();
    expect(fragment.textContent?.trim()).to.equal("ab");
  });

});
