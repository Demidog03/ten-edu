import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClient } from '../../core/http/api-client.service';
import {LoginPayload, LoginResponse, Profile, RegisterPayload, RegisterResponse} from './auth.types';
import {BYPASS_AUTH} from '../../core/http/auth.interceptor';
import { HttpContext } from '@angular/common/http';

const ENDPOINTS = {
  register: 'users/register/',
  login: 'users/login/',
  profile: 'users/profile/',
} as const;

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private api = inject(ApiClient);

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    const phone =
      payload.phone === null
        ? null
        : String(payload.phone).replace(/\D/g, '') || null;

    const body: RegisterPayload = {
      ...payload,
      phone,
      role: payload.role ?? null,
      image_id: payload.image_id ?? null,
    };

    const ctx = new HttpContext().set(BYPASS_AUTH, true);
    return this.api.post<RegisterResponse>(ENDPOINTS.register, body);
  }

  login(payload: LoginPayload) {
    const ctx = new HttpContext().set(BYPASS_AUTH, true);
    return this.api.post<LoginResponse>(ENDPOINTS.login, payload, undefined, { context: ctx });
  }
  profile() {
    return this.api.get<Profile>(ENDPOINTS.profile);
  }
}
