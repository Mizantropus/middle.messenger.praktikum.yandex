import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';

export default class MenuItem extends Block {
  constructor(props: AnyProps, classname: string) {
    super("li", props, classname);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      title: this.props.title,
      name: this.props.name,
      url: this.props.url
    });
  }
}
