import { AnyProps, Block } from "../../core/block";
import template from "./template.hbs";
import template_left_col from "./left_col.hbs";
import template_right_col from "./right_col.hbs";


export class LeftCol extends Block { 
  constructor(props: AnyProps, classname: string) {
    super("div", props, classname);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template_left_col, {
      search_input: this.props.search_input,
      list: this.props.list,
      add_chat: this.props.add_chat
    });
  }
}

export class RightCol extends Block {
  constructor(props: AnyProps, classname: string) {
    super("div", props, classname);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template_right_col, {
      send_message_attach: this.props.send_message_attach,
      send_message_input: this.props.send_message_input,
      send_message_button: this.props.send_message_button,
      letter: this.props.letter,
      add_user: this.props.add_user,
      delete_user: this.props.delete_user,
      delete_chat: this.props.delete_chat,
      list: this.props.list
    });
  }
}

export class Page extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      left_col: this.props.left_col,
      right_col: this.props.right_col
    });
  }
}
