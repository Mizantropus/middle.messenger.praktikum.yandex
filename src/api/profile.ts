import { fetchWithRetry, RequestOptions, HTTPMethod, METHODS } from '../core/ajax';
import { YANDEX_DOMAIN } from '../core/constants';
import { BaseAPI } from './base-api';
import { ProfileFormModel, ProfilePasswordModel } from './types';


export default class ProfileAPI extends BaseAPI<XMLHttpRequest, RequestOptions> {
  public async request(data: RequestOptions): Promise<XMLHttpRequest> {
    let method: HTTPMethod = METHODS.GET;
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/auth/user`,
      method,
      data
    );
  }

  public async edit(data: RequestOptions<ProfileFormModel>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = METHODS.PUT;
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/user/profile`,
      method,
      data
    );
  }

  public async save_avatar(data: RequestOptions<FormData>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = METHODS.PUT;
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/user/profile/avatar`,
      method,
      data
    );
  }

  public async change_password(data: RequestOptions<ProfilePasswordModel>): Promise<XMLHttpRequest> {
    let method: HTTPMethod = METHODS.PUT;
    if (data.method) {
      method = data.method;
    }
    return await fetchWithRetry(
      `${YANDEX_DOMAIN}/user/password`,
      method,
      data
    );
  }
}
