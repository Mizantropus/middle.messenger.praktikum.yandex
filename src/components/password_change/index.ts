import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';


export default class FormPassword extends Block {
  constructor(props: AnyProps, classname: string) {
    super("form", props, classname);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      old_password: this.props.old_password,
      new_password: this.props.new_password,
      button_save_password: this.props.button_save_password,
      events: this.props.events
    });
  }
}
