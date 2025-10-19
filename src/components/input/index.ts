import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';

export default class Input extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      title: this.props.title,
      name: this.props.name,
      type: this.props.type,
      value: this.props.value,
      accept: this.props.accept,
      events: this.props.events
    });
  }
}
