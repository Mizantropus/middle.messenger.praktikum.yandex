import { fetchWithRetry, RequestOptions, HTTPMethod } from '../core/ajax';
import { BaseAPI } from './base-api';
import { ProfileFormModel, ProfilePasswordModel } from './types';


export default class ProfileAPI extends BaseAPI<XMLHttpRequest, RequestOptions> {
  public async request(data: RequestOptions): Promise<XMLHttpRequest> {
    let method: HTTPMethod = 'GET';
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/auth/user",
      method,
      data
    );
  }

  public async edit(data: RequestOptions<ProfileFormModel>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = 'PUT';
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/user/profile",
      method,
      data
    );
  }

  public async save_avatar(data: RequestOptions<FormData>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = 'PUT';
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/user/profile/avatar",
      method,
      data
    );
  }

  public async change_password(data: RequestOptions<ProfilePasswordModel>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = 'PUT';
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      "https://ya-praktikum.tech/api/v2/user/password",
      method,
      data
    );
  }
}
