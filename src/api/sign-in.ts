import { fetchWithRetry, RequestOptions, HTTPMethod, METHODS } from '../core/ajax';
import { YANDEX_DOMAIN } from '../core/constants';
import { BaseAPI } from './base-api';
import { SignInFormModel } from './types';


export default class SignInAPI extends BaseAPI<XMLHttpRequest, RequestOptions<SignInFormModel>> {
  public async request(data: RequestOptions<SignInFormModel>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = METHODS.POST;
    if (data.method) {
      method = data.method;
    }
    return fetchWithRetry(
      `${YANDEX_DOMAIN}/auth/signin`,
      method,
      data
    );
  }

  public async logout(data: RequestOptions) {
    let method: HTTPMethod = METHODS.POST;
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/auth/logout`,
      method,
      data
    );
  }
}
