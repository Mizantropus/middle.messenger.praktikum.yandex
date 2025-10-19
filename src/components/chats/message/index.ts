import { AnyProps, Block } from "../../../core/block";
import template from './template.hbs';

export default class Message extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      m_class: this.props.m_class,
      text: this.props.text,
      datetime: this.props.datetime
    });
  }
}
