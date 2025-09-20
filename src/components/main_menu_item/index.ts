import { AnyProps, Block } from "../../core/block";
import template from './template.hbs';

export default class MenuItem extends Block {
  constructor(props: AnyProps) {
    super("li", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      title: this.props.title,
      name: this.props.name,
      url: this.props.url
    });
  }
}
