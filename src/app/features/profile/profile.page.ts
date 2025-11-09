import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { AuthStore } from '../../core/auth/auth.store';

type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined;

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, CardModule, DividerModule, Avatar, Tag, Tooltip],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {
  private store = inject(AuthStore);

  userSig = this.store.user;
  isLoggedIn = computed(() => this.store.isLoggedIn());

  initials(name?: string | null) {
    const n = (name || '').trim();
    if (!n) return 'U';
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]).join('').toUpperCase();
  }

  roleLabel(role?: string | null) {
    const map: Record<string, string> = {
      site_admin: 'Админ сайта',
      center_admin: 'Админ центра',
      user: 'Пользователь'
    };
    return role ? (map[role] ?? role) : '—';
  }

  roleSeverity(role?: string | null): TagSeverity {
    switch (role) {
      case 'site_admin':   return 'danger';
      case 'center_admin': return 'warn';      // ← раньше было "warning"
      case 'user':         return 'success';
      default:             return 'info';
    }
  }

  statusSeverity(active?: boolean): TagSeverity {
    return active ? 'success' : 'danger';
  }

  logout() {
    this.store.logout();
  }
}
