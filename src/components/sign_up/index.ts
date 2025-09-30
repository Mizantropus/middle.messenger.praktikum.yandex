import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';


export default class Form extends Block {
  constructor(props: AnyProps) {
    super("form", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      name: this.props.name,
      surname: this.props.surname,
      login: this.props.login,
      email: this.props.email,
      phone: this.props.phone,
      password: this.props.password,
      button: this.props.button,
      events: this.props.events
    });
  }
}
