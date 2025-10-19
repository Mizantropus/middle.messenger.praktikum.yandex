import { AnyProps, Block } from "../../../core/block";
import template from './add_user.hbs';
import template_delete_user from './delete_user.hbs';
import user_to_del_tmp from './user_to_del_tmp.hbs';

export class AddUser extends Block {
  constructor(props: AnyProps) {
    super("form", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      input: this.props.input,
      button: this.props.button,
      events: this.props.events
    });
  }
}

export class ChatMember extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      user_id: this.props.user_id,
      chat_id: this.props.chat_id,
      events: this.props.events
    });
  }
}

export class UserToDel extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(user_to_del_tmp, {
      username: this.props.username,
      id: this.props.id,
      events: this.props.events
    });
  }
}

export class DeleteUser extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template_delete_user, {
      list: this.props.list
    });
  }
}
