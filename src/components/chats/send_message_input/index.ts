import { AnyProps, Block } from "../../../core/block";
import template from './template.hbs';

export default class MessageInput extends Block {
  constructor(props: AnyProps, classname: string) {
    super("div", props, classname);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      type: this.props.type,
      name: this.props.name,
      value: this.props.value,
      placeholder: this.props.placeholde,
      events: this.props.events
    });
  }
}
