import { v4 as makeUUID } from "uuid";
import Handlebars from "handlebars";
import EventBus from "./mediator";


type ChildAsProps = Record<string, Block<any>>;
type ChildrenList = Block<any>[];
type EventsMap = Record<string, (event: Event) => void>;

export type AnyProps = Partial<{
  _id?: string;
  events?: EventsMap;
  list?: ChildrenList | string;
}> & Record<string, unknown>;

export abstract class Block<Props extends AnyProps = AnyProps> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: 'flow:render',
  } as const;

  protected _element!: HTMLElement;
  protected _id!: string;
  protected _tagName: string;
  protected _classname: string | null;
  protected props: Props;
  protected events: EventsMap;
  protected children?: ChildAsProps;
  protected children_list?: ChildrenList;
  protected eventBus: EventBus;

  constructor(
    tagName: string = "div",
    propsAndChildren: Props = {} as Props,
    classname: string | null = null
  ) {
    this._classname = classname;
    this._id = makeUUID();
    this._tagName = tagName;
    this.eventBus = new EventBus();

    this.props = this._makePropsProxy({
      ...propsAndChildren,
      _id: this._id
    } as Props);

    const { children, children_list } = this._extractChildren(propsAndChildren);
    this.children = children;
    this.children_list = children_list;

    const events: EventsMap = (this.props.events as EventsMap) ?? {};
    this.events = {};
    this._setCustomEvents(events);

    this._registerEvents(this.eventBus);
    this.eventBus.emit(Block.EVENTS.INIT);
  }

  private _setCustomEvents(events: EventsMap): void {
    Object.keys(events).forEach((eventName) => {
      this.events[eventName] = events[eventName].bind(this);
    });
  }

  private _extractChildren(props: Props): { children?: ChildAsProps; children_list?: ChildrenList } {
    const children: ChildAsProps = {};
    const children_list: ChildrenList = [];
    for (const [key, value] of Object.entries(props)) {
      if (
        Array.isArray(value) &&
        value.every((v) => v instanceof Block) &&
        key === "list"
      ) {
        children_list.push(...value);
      } else if (value instanceof Block) {
        children[key] = value;
      }
    }
    return {
      children: Object.keys(children).length > 0 ? children : undefined,
      children_list: children_list.length > 0 ? children_list : undefined,
    };
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
      Object.values(this.children).forEach((child) => {
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

  private _componentDidUpdate(oldProps: Props, newProps: Props): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render(false);
  }

  protected componentDidUpdate(oldProps: Props, newProps: Props): boolean {
    if (oldProps && newProps) {
      return true;
    }
    return true;
  }

  public setProps(nextProps: Partial<Props>): void {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  }

  public updateChildren(key: string, new_children: Block<any>): void {
    if (!new_children || !key) {
      return;
    }
    if (this.children) {
      this.children[key] = new_children;
      this._render(false);
    }
  }

  public updateChildrenList(new_list: ChildrenList): void {
    if (!new_list) {
      return;
    }
    if (this.children_list) {
      this.children_list = new_list;
      this._render(false);
    }
  }

  get element(): HTMLElement {
    return this._element;
  }

  private _addEvents(): void {
    Object.keys(this.events).forEach((eventName) => {
      let target = this._element;
      if (eventName === "blur") {
        target = this._element.querySelector('input') as HTMLInputElement;
      }
      target.addEventListener(eventName, this.events[eventName]);
    });
  }

  private _removeEvents(): void {
    Object.keys(this.events).forEach((eventName) => {
      let target = this._element;
      if (eventName === "blur") {
        target = this._element.querySelector('input') as HTMLInputElement;
      }
      target.removeEventListener(eventName, this.events[eventName]);
    });
  }

  private _render(intial: boolean = true): void {
    if (!intial) {
      this._removeEvents();
    }
    const block: DocumentFragment = this.render();
    this._element.innerHTML = '';
    this._element.appendChild(block);
    this._addEvents();
  }

  abstract render(): DocumentFragment;

  public getContent(): HTMLElement {
    return this.element;
  }

  private _makePropsProxy(props: Props): Props {
    const self = this;
    return new Proxy(props, {
      get(target: Props, prop: string) {
        if (prop.startsWith('_')) {
          throw new Error('Отказано в доступе');
        }
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: Props, prop: string, value: unknown) {
        const oldProps = { ...target };
        (target as any)[prop] = value;
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

  protected compile(template: string, props: Props): DocumentFragment {
    const propsAndStubs: AnyProps = { ...props };

    if (this.children) {
      Object.entries(this.children).forEach(([key, child]) => {
        propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
      });
    }

    if (this.children_list && "list" in propsAndStubs) {
      let list_str = "";
      for (let child_item of this.children_list) {
        list_str += `<div data-id="${child_item._id}"></div>`;
      }
      propsAndStubs.list = list_str;
    }

    if (this.events && "events" in propsAndStubs) {
      if (propsAndStubs.events) {
        this._setCustomEvents(propsAndStubs.events as EventsMap);
      }
    }

    const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
    const hndlr_tpl = Handlebars.compile(template)(propsAndStubs);
    fragment.innerHTML = hndlr_tpl;

    if (this.children) {
      Object.values(this.children).forEach((child) => {
        const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
        if (stub) {
          stub.replaceWith(child.getContent());
        }
      });
    }

    if (this.children_list) {
      for (let child_item of this.children_list) {
        const stub = fragment.content.querySelector(`[data-id="${child_item._id}"]`);
        if (stub) {
          stub.replaceWith(child_item.getContent());
        }
      }
    }

    return fragment.content;
  }
}
