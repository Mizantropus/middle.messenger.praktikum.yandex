import Block from "../../core/block";
import template from "./template.hbs";
import template_left_col from "./left_col.hbs";
import template_right_col from "./right_col.hbs";


export class LeftCol extends Block { 
  constructor(props, classname) {
    super("div", props, classname);
  }
  render(): DocumentFragment {
    return this.compile(template_left_col, {
      search_input: this.props.search_input,
      list: this.props.list
    });
  }
}

export class RightCol extends Block {
  constructor(props, classname) {
    super("div", props, classname);
  }
  render(): DocumentFragment {
    return this.compile(template_right_col, {
      send_message_attach: this.props.send_message_attach,
      send_message_input: this.props.send_message_input,
      send_message_button: this.props.send_message_button,
      letter: this.props.letter,
      list: this.props.list
    });
  }
}

export class Page extends Block {
  constructor(props) {
    super("div", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      left_col: this.props.left_col,
      right_col: this.props.right_col
    });
  }
}
