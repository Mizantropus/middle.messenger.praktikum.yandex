export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type HTTPMethodSmall = 'get' | 'post' | 'put' | 'delete';
type dataRequestValue = string | number | null | boolean | undefined;

export const METHODS: Record<HTTPMethod, HTTPMethod> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const METHODS_COMPARISON: Record<HTTPMethod, HTTPMethodSmall> = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

export interface RequestOptions<T = Record<string, dataRequestValue>> {
  method?: HTTPMethod;
  data?: T;
  headers?: Record<string, string>;
  timeout?: number;
}

export function queryStringify(data: Record<string, dataRequestValue> = {}): string {
  const keys = Object.keys(data);
  if (!keys.length) return '';
  const query = keys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(data[key]))}`)
    .join('&');
  return `?${query}`;
}

export class HTTPTransport<T = Record<string, dataRequestValue> | FormData> {
  async get(url: string, options: RequestOptions<T> = {}, timeout: number = 5000): Promise<XMLHttpRequest> {
    if (options.data) {
      url += queryStringify(options.data);
    }
    return await this.request(url, { ...options, method: METHODS.GET }, timeout);
  }

  async post(url: string, options: RequestOptions<T> = {}, timeout: number = 5000): Promise<XMLHttpRequest> {
    return await this.request(url, { ...options, method: METHODS.POST }, timeout);
  }

  async put(url: string, options: RequestOptions<T> = {}, timeout: number = 5000): Promise<XMLHttpRequest> {
    return await this.request(url, { ...options, method: METHODS.PUT }, timeout);
  }

  async delete(url: string, options: RequestOptions<T> = {}, timeout: number = 5000): Promise<XMLHttpRequest> {
    return await this.request(url, { ...options, method: METHODS.DELETE }, timeout);
  }

  request(url: string, options: RequestOptions<T>, timeout: number): Promise<XMLHttpRequest> {
    const { method, data, headers = {} } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('Метод не указан'));
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.timeout = timeout;
      xhr.withCredentials = true;

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => resolve(xhr);
      xhr.onerror = () => reject(new Error('Ошибка запроса'));
      xhr.ontimeout = () => reject(new Error('Превышено время ожидания'));

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  }
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function fetchWithRetry<T = Record<string, dataRequestValue>>(
  url: string,
  method: HTTPMethod,
  options: RequestOptions<T>,
  tries: number = 3
): Promise<XMLHttpRequest> {
  if (tries < 2) {
    throw new Error('Свойство tries должно быть числом больше 1');
  }
  const transport = new HTTPTransport<T>();
  let attempt = 0;
  const baseDelay = 500;
  let comparsed_method: HTTPMethodSmall = METHODS_COMPARISON[method];

  async function tryRequest(): Promise<XMLHttpRequest> {
    attempt++;
    const delay = baseDelay * attempt;
    return await transport[comparsed_method](url, options, 5000)
      .then(xhr => {
        if (xhr.status >= 200 && xhr.status < 300) {
          return xhr;
        } else {
          throw new Error(`Ошибка ответа: ${xhr.status}`);
        }
      })
      .catch(error => {
        if (attempt < tries) {
          return wait(delay).then(() => tryRequest());
        } else {
          throw new Error(`Не удалось получить данные за ${tries} попыток: ${error.message}`);
        }
      });
  }

  return tryRequest();
}
