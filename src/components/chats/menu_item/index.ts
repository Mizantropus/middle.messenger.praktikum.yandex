import { AnyProps, Block } from "../../../core/block";
import template from "./template.hbs";

export default class MenuItem extends Block {
  constructor(props: AnyProps, classname: string) {
    super("div", props, classname);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      title: this.props.title,
      id: this.props.id,
      events: this.props.events
    });
  }
}
