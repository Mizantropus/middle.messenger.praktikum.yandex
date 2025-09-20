import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';

export default class MainMenu extends Block {
  constructor(props: AnyProps, classname: string) {
    super("div", props, classname);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      header: this.props.header,
      list: this.props.list
    });
  }
}
