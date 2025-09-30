import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';


export default class FormProfile extends Block {
  constructor(props: AnyProps) {
    super("form", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      avatar: this.props.avatar,
      display_name_value: this.props.display_name_value,
      name: this.props.name,
      surname: this.props.surname,
      display_name: this.props.display_name,
      login: this.props.login,
      email: this.props.email,
      phone: this.props.phone,
      button_save_profile: this.props.button_save_profile,
      events: this.props.events
    });
  }
}
