import { fetchWithRetry, RequestOptions, HTTPMethod } from '../core/ajax';
import { BaseAPI } from './base-api';
import { SignUpFormModel } from './types';


export default class SignUpAPI extends BaseAPI<XMLHttpRequest, RequestOptions<SignUpFormModel>> {
  public create(data: RequestOptions<SignUpFormModel>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = 'POST';
    if (data.method) {
      method = data.method;
    }
    return fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/auth/signup",
      method,
      data
    );
  }
}
