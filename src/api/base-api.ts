import { RequestOptions } from '../core/ajax';

export class BaseAPI<Res = unknown, Req = RequestOptions> {
  public create(_data?: Req): Promise<Res> {
    return Promise.reject(new Error("Not implemented"));
  }

  public request(_data?: Req): Promise<Res> {
    return Promise.reject(new Error("Not implemented"));
  }

  public update(_id?: string | number, _payload?: Req): Promise<Res> {
    return Promise.reject(new Error("Not implemented"));
  }

  public delete(_id?: string | number): Promise<Res> {
    return Promise.reject(new Error("Not implemented"));
  }
}
