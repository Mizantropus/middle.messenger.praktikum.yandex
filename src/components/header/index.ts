import Block from "../../core/block";
import template from './template.hbs';

export default class Header extends Block {
  constructor(props) {
    super("header", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      title: this.props.title
    });
  }
}
