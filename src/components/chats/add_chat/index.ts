import { AnyProps, Block } from "../../../core/block";
import template from './template.hbs';

export default class AddChat extends Block {
  constructor(props: AnyProps, classname: string) {
    super("div", props, classname);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      pidor: this.props.pidor,
      events: this.props.events
    });
  }
}
