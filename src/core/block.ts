import {v4 as makeUUID} from "uuid";
import Handlebars from "handlebars";
import EventBus from "./mediator";

type ChildenAsProps = Record<string, Block>;
type ChildrenList = Block[];
type EventsProps = Record<string, Function> | {};
type AnyProps = Partial<{
  events?: EventsProps | {},
  list?: ChildrenList | [] | string,
}> & Record<string, unknown>;
type AnyPropValue = Partial<string | Function | Block>
type CombineProps = {
  props: AnyProps,
  children?: ChildenAsProps,
  children_list?: ChildrenList
}

export default abstract class Block {

  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: 'flow:render',
  };

  protected _element: HTMLElement;
  protected _id: string;
  protected _tagName: string;
  protected _classname: string | null;
  protected props: AnyProps;
  protected events: EventsProps;
  protected children: ChildenAsProps | undefined;
  protected children_list: ChildrenList | undefined;
  protected eventBus: EventBus;

  constructor(tagName: string = "div", propsAndChildren: AnyProps = {},
              classname: string | null = null) {
    const { children, props, children_list } = this._getChildren(propsAndChildren);
    this.children = children;
    this.children_list = children_list;
    this._classname = classname;
    this.props = this._makePropsProxy({...props, _id: this._id});
    const events: EventsProps = this.props?.events ?? {};
    this.events = {};
    this._setCustomEvents(events);
    this._tagName = tagName;
    this._id = makeUUID();
    this.eventBus = new EventBus();
    this._registerEvents(this.eventBus);
    this.eventBus.emit(Block.EVENTS.INIT);
  }

  private _setCustomEvents(events: EventsProps): void {
    Object.keys(events).forEach(eventName => {
      this.events[eventName] = events[eventName].bind(this);
    });
  }

  private _getChildren(propsAndChildren: AnyProps): CombineProps {
    const children: ChildenAsProps = {};
    const props: AnyProps = {};
    const children_list: ChildrenList = [];
    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value) &&
          value.every(v => v instanceof Block) &&
          key === "list") {
        children_list.push(...value);
      } else if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });
    let result = { children, props }
    if (children_list.length) {
      result["children_list"] = children_list;
    }
    return result;
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources(): void {
    this._element = this._createDocumentElement(this._tagName);
    if (this._classname) {
      this._element.className = this._classname;
    }
  }

  protected init(): void {
    this._createResources();
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();
    if (this.children) {
      Object.values(this.children).forEach(child => {
        child.dispatchComponentDidMount();
      });
    }
    if (this.children_list) {
      for (let child of this.children_list) {
        child.dispatchComponentDidMount();
      }
    }
  }

  protected componentDidMount(): void {}

  protected dispatchComponentDidMount(): void {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps, newProps): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  protected componentDidUpdate(oldProps: AnyProps, newProps: AnyProps): boolean {
    console.log(oldProps, newProps);
    return true;
  }

  public setProps(nextProps: AnyProps): void {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  public updateChildren(key: string, new_children: Block): void {
    if (!new_children || !key) {
      return;
    }
    if (this.children) {
      this.children[key] = new_children;
      this._render();
    }
  };

  public updateChildrenList(new_list: ChildrenList): void {
    if (!new_list) {
      return;
    }
    if (this.children_list) {
      this.children_list = new_list;
      this._render();
    }
  };

  get element(): HTMLElement {
    return this._element;
  }

  private _addEvents(): void {
    Object.keys(this.events).forEach(eventName => {
      this._element.addEventListener(eventName, this.events[eventName]);
    });
  }

  private _removeEvents(): void {
    Object.keys(this.events).forEach(eventName => {
      this._element.removeEventListener(eventName, this.events[eventName]);
    });
  }

  private _render(): void {
    this._removeEvents();
    const block: DocumentFragment = this.render();
    this._element.innerHTML = '';
    this._element.appendChild(block);
    this._addEvents();
  }

  abstract render(): DocumentFragment;

  public getContent(): HTMLElement {
    return this.element;
  }

  private _makePropsProxy (props: AnyProps): AnyProps {
    let self = this;
    return new Proxy(props, {
      get(target: AnyProps, prop: string) {
        if (prop.indexOf('_') === 0) {
          throw new Error('Отказано в доступе');
        }
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target: AnyProps, prop: string, value: AnyPropValue) {
        const oldProps = { ...target };
        target[prop] = value;
        self.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Отказано в доступе');
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    const element = document.createElement(tagName);
    element.setAttribute('data-id', this._id);
    return element;
  }

  public show(): void {
    this.getContent().style.display = "block";
  }

  public hide(): void {
    this.getContent().style.display = "none";
  }

  protected compile(template: string, props: AnyProps): DocumentFragment {

    const propsAndStubs: AnyProps = { ...props };
    if (this.children) {
      Object.entries(this.children).forEach(([key, child]) => {
        propsAndStubs[key] = `<div data-id="${child._id}"></div>`
      });
    }
    if (this.children_list && "list" in propsAndStubs) {
      let list_str: string = "";
      for (let child_item of this.children_list) {
        list_str += `<div data-id="${child_item._id}"></div>`;
      }
      propsAndStubs.list = list_str;
    }
    if (this.events && "events" in propsAndStubs) {
      if (propsAndStubs.events) {
        this._setCustomEvents(propsAndStubs.events);
      }
    }
    const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
    const hndlr_tpl = Handlebars.compile(template)(propsAndStubs);
    fragment.innerHTML = hndlr_tpl;
    if (this.children) {
      Object.values(this.children).forEach(child => {
        const stub: HTMLElement | null = fragment.content.querySelector(`[data-id="${child._id}"]`);
        if (stub) {
          stub.replaceWith(child.getContent());
        }
      });
    }
    if (this.children_list) {
      for (let child_item of this.children_list) {
        const stub: HTMLElement | null = fragment.content.querySelector(`[data-id="${child_item._id}"]`);
        if (stub) {
          stub.replaceWith(child_item.getContent());
        }
      }
    }
    return fragment.content;
  }

}
