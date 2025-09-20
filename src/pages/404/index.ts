import { AnyProps, Block } from "../../core/block";
import template from "./template.hbs";

export default class Page extends Block {
  constructor(props: AnyProps) {
    super("div", props);
  }
  render(): DocumentFragment {
    return this.compile(template, {});
  }
}

export const Page404: Page = new Page({})
