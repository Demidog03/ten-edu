import {
  Injectable, inject, PLATFORM_ID,
  signal, computed, effect
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {isExpired} from './jwt.util';

type Profile = {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'site_admin' | 'center_admin' | 'user';
  is_active: boolean;
  image?: { id: number; file_name: string; file_url: string } | null;
  image_id: number | null;
  created_at: string;
  updated_at: string;
};

type Session = {
  access: string | null;
  refresh: string | null;
  user: Profile | null;
};

type Persisted = { access: string | null; refresh: string | null };

const LS_KEY = 'auth.session.v1';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private platformId = inject(PLATFORM_ID);
  private browser = isPlatformBrowser(this.platformId);

  private _session = signal<Session>({
    access: null,
    refresh: null,
    user: null,
  });

  session   = computed(() => this._session());
  access    = computed(() => this._session().access);
  refresh   = computed(() => this._session().refresh);
  user      = computed(() => this._session().user);
  isLoggedIn = computed(() => {
    const t = this._session().access;
    return !!t && !isExpired(t);
  });

  constructor() {
    if (this.browser) {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        try {
          const p = JSON.parse(raw) as Persisted;
          this._session.set({ access: p.access, refresh: p.refresh, user: null });
          if (isExpired(p.access)) this.logout(false);
        } catch {}
      }
      effect(() => {
        const s = this._session();
        const toSave: Persisted = { access: s.access, refresh: s.refresh };
        localStorage.setItem(LS_KEY, JSON.stringify(toSave));
      });
    }
  }

  setTokens(tokens: { access?: string | null; refresh?: string | null }) {
    const s = this._session();
    this._session.set({
      ...s,
      access: tokens.access ?? null,
      refresh: tokens.refresh ?? null,
    });
  }

  setUser(user: Profile | null) {
    const s = this._session();
    this._session.set({ ...s, user });
  }

  logout(hard = true) {
    this._session.set({ access: null, refresh: null, user: null });
    if (hard && this.browser) localStorage.removeItem(LS_KEY);
  }
}
