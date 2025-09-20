type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const METHODS: Record<HTTPMethod, HTTPMethod> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

interface RequestOptions {
  method?: HTTPMethod;
  data?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

function queryStringify(data: Record<string, any> = {}): string {
  const keys = Object.keys(data);
  if (!keys.length) return '';
  const query = keys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
  return `?${query}`;
}

export class HTTPTransport {
  get(url: string, options: RequestOptions = {}, timeout: number = 5000): Promise<XMLHttpRequest> {
    if (options.data) {
      url += queryStringify(options.data);
    }
    return this.request(url, { ...options, method: METHODS.GET }, timeout);
  }

  post(url: string, options: RequestOptions = {}, timeout: number = 5000): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHODS.POST }, timeout);
  }

  put(url: string, options: RequestOptions = {}, timeout: number = 5000): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHODS.PUT }, timeout);
  }

  delete(url: string, options: RequestOptions = {}, timeout: number = 5000): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHODS.DELETE }, timeout);
  }

  request(url: string, options: RequestOptions, timeout: number): Promise<XMLHttpRequest> {
    const { method, data, headers = {} } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('Метод не указан'));
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.timeout = timeout;

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => resolve(xhr);
      xhr.onerror = () => reject(new Error('Ошибка запроса'));
      xhr.ontimeout = () => reject(new Error('Превышено время ожидания'));

      if (method === METHODS.GET || !data) {
        xhr.send();
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

export function fetchWithRetry(
  url: string,
  method: keyof HTTPTransport,
  options: RequestOptions,
  tries: number = 3
): Promise<XMLHttpRequest> {
  if (tries < 2) {
    throw new Error('Свойство tries должно быть числом больше 1');
  }
  const transport = new HTTPTransport();
  let attempt = 0;
  const baseDelay = 500;

  function tryRequest(): Promise<XMLHttpRequest> {
    attempt++;
    const delay = baseDelay * attempt;
    return transport[method](url, options, 5000)
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
