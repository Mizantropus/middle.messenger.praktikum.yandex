import Block from "../../core/block";
import template from './template.hbs';

export default class MainMenu extends Block {
  constructor(props) {
    super("main", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      header: this.props.header,
      list: this.props.list
    });
  }
}
