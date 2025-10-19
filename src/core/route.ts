import { Block } from "./block";
import render from "./render";
import isEqual from "../core/service/isEqual";

export default class Route {

  protected _pathname: String;
  protected _block: Block;
  protected _props: Record<string, string>;
  protected _is_rendered: boolean = false;
  public need_auth: boolean = false;

  constructor(pathname: String, block: Block, props: Record<string, string>, need_auth: boolean = false) {
    this._pathname = pathname;
    this._block = block;
    this._props = props;
    this.need_auth = need_auth;
  }

  navigate(pathname: String) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.kill();
    }
  }

  match(pathname: String) {
    return isEqual(pathname, this._pathname);
  }

  render() {
    if (!this._is_rendered) {
      render(this._props.rootQuery, this._block);
      this._is_rendered = true;
      return;
    }
    this._block.show();
  }
}
