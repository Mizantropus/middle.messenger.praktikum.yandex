import { AnyProps, Block } from "../../../core/block";
import template from './template.hbs';

export default class Friend extends Block {
  constructor(props: AnyProps, classname: string) {
    super("div", props, classname);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      name: this.props.name,
      last_time: this.props.last_time,
      last_message: this.props.last_message,
      letter: this.props.letter,
      unread: this.props.unread,
      events: this.props.events,
      id: this.props.id
    });
  }
}
