import Block from "../../../core/block";
import template from './template.hbs';

export default class Input extends Block {
  constructor(props) {
    super("div", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {
      title: this.props.title,
      name: this.props.name,
      type: this.props.type,
      value: this.props.value,
      placeholder: this.props.placeholder,
      events: this.props.events
    });
  }
}
