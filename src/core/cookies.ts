export type CookieOptions = {
  path?: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
};

export class SimpleCookie {
  set(name: string, value: string, options: CookieOptions = {}) {
    if (!name) throw new Error('Cookie name required');
    const parts: string[] = [
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    ];
    if (options.maxAge != null) parts.push(`Max-Age=${Math.floor(options.maxAge)}`);
    else if (options.expires instanceof Date) parts.push(`Expires=${options.expires.toUTCString()}`);
    if (options.path) parts.push(`Path=${options.path}`);
    if (options.secure) parts.push('Secure');
    if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
    document.cookie = parts.join('; ');
  }

  get(name: string): string | undefined {
    if (!name) return undefined;
    const encoded = encodeURIComponent(name) + '=';
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const c of cookies) {
      if (c.indexOf(encoded) === 0) {
        return decodeURIComponent(c.substring(encoded.length));
      }
    }
    return undefined;
  }

  delete(name: string, options: CookieOptions = {}) {
    if (!name) throw new Error('Cookie name required');
    const parts: string[] = [
      `${encodeURIComponent(name)}=`
    ];
    parts.push(`Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    if (options.path) parts.push(`Path=${options.path}`);
    if (options.secure) parts.push('Secure');
    if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
    document.cookie = parts.join('; ');
  }
}
