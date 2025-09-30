import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';


export default class Form extends Block {
  constructor(props: AnyProps) {
    super("form", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      login: this.props.login,
      password: this.props.password,
      button: this.props.button,
      events: this.props.events
    });
  }
}
