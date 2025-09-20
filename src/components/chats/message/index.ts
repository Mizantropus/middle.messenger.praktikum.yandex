import Block from "../../../core/block";
import template from './template.hbs';

export default class Message extends Block {
  constructor(props) {
    super("div", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      m_class: this.props.m_class,
      text: this.props.text,
      datetime: this.props.datetime
    });
  }
}
