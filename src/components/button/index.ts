import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';

export default class Button extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      text: this.props.text,
      type: this.props.type,
      events: this.props.events
    });
  }
}
