import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';

export default class Header extends Block {
  constructor(props: AnyProps) {
    super("header", props);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      title: this.props.title
    });
  }
}
