import { AnyProps, Block } from "../../../core/block";
import template from './template.hbs';


export default class Form extends Block {
  constructor(props: AnyProps, classname: string) {
    super("form", props, classname);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      send_message_attach: this.props.send_message_attach,
      send_message_input: this.props.send_message_input,
      send_message_button: this.props.send_message_button,
      events: this.props.events
    });
  }
}
