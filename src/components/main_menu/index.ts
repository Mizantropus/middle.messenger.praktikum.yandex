import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';

export default class MainMenu extends Block {
  constructor(props: AnyProps, classname: string) {
    super("div", props, classname);
  }
  async render(): Promise<DocumentFragment> {
    return this.compile(template, {
      header: this.props.header,
      list: this.props.list
    });
  }
}
