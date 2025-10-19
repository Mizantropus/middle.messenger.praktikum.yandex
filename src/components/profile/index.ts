import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';
import template_ava from './template_ava.hbs';
import connect from "../../api/service"


class FormProfile extends Block {
  constructor(props: AnyProps) {
    super("form", props); 
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      avatar: this.props.avatar,
      name: this.props.name,
      surname: this.props.surname,
      display_name: this.props.display_name,
      login: this.props.login,
      email: this.props.email,
      id: this.props.id,
      phone: this.props.phone,
      button_save_profile: this.props.button_save_profile,
      events: this.props.events
    });
  }
}

const withUser = connect(state => ({ user: state.user }));
export const FormProfileFiltred = withUser(FormProfile);


class FormAvatar extends Block {
  constructor(props: AnyProps) {
    super("div", props); 
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template_ava, {
      avatar_url: this.props.avatar_url,
      button: this.props.button,
      input: this.props.input,
      events: this.props.events
    });
  }
}

export const FormAvatarFiltred = withUser(FormAvatar);
