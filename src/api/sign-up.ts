import { fetchWithRetry, RequestOptions, HTTPMethod, METHODS } from '../core/ajax';
import { YANDEX_DOMAIN } from '../core/constants';
import { BaseAPI } from './base-api';
import { SignUpFormModel } from './types';


export default class SignUpAPI extends BaseAPI<XMLHttpRequest, RequestOptions<SignUpFormModel>> {
  public create(data: RequestOptions<SignUpFormModel>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = METHODS.POST;
    if (data.method) {
      method = data.method;
    }
    return fetchWithRetry(
      `${YANDEX_DOMAIN}/auth/signup`,
      method,
      data
    );
  }
}
