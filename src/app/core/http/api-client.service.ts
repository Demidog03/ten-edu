import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from './api.config';

type Query = Record<string, string | number | boolean | undefined | null>;
type Opts = { context?: HttpContext } & Record<string, any>;

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  private buildUrl(path: string) {
    if (/^https?:\/\//i.test(path)) return path;
    const base = this.baseUrl.replace(/\/+$/, '');
    const rel  = path.replace(/^\/+/, '');
    return `${base}/${rel}`;
  }

  private buildParams(q?: Query) {
    let params = new HttpParams();
    if (q) {
      for (const [k, v] of Object.entries(q)) {
        if (v !== undefined && v !== null) params = params.set(k, String(v));
      }
    }
    return params;
  }

  get<T>(path: string, query?: Query, opts: Opts = {}) {
    return this.http.get<T>(this.buildUrl(path), {
      params: this.buildParams(query),
      ...opts,
    });
  }

  post<T, B = unknown>(path: string, body?: B, query?: Query, opts: Opts = {}) {
    return this.http.post<T>(this.buildUrl(path), body, {
      params: this.buildParams(query),
      ...opts,
    });
  }

  put<T, B = unknown>(path: string, body?: B, query?: Query, opts: Opts = {}) {
    return this.http.put<T>(this.buildUrl(path), body, {
      params: this.buildParams(query),
      ...opts,
    });
  }

  patch<T, B = unknown>(path: string, body?: B, query?: Query, opts: Opts = {}) {
    return this.http.patch<T>(this.buildUrl(path), body, {
      params: this.buildParams(query),
      ...opts,
    });
  }

  delete<T>(path: string, query?: Query, opts: Opts = {}) {
    return this.http.delete<T>(this.buildUrl(path), {
      params: this.buildParams(query),
      ...opts,
    });
  }
}
