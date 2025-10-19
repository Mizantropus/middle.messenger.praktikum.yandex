import { fetchWithRetry, RequestOptions, HTTPMethod } from '../core/ajax';
import { BaseAPI } from './base-api';
import { SignInFormModel } from './types';


export default class SignInAPI extends BaseAPI<XMLHttpRequest, RequestOptions<SignInFormModel>> {
  public async request(data: RequestOptions<SignInFormModel>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = 'POST';
    if (data.method) {
      method = data.method;
    }
    return fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/auth/signin",
      method,
      data
    );
  }

  public async logout(data: RequestOptions) {
    let method: HTTPMethod = 'POST';
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/auth/logout",
      method,
      data
    );
  }
}
