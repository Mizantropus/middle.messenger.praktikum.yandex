import { AnyProps, Block } from "../../../core/block";
import template from './template.hbs';

export default class MessageButton extends Block {
  constructor(props: AnyProps, classname: string) {
    super("div", props, classname);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      image: this.props.image,
      events: this.props.events
    });
  }
}
