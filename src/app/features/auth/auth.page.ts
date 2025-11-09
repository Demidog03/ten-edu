import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Select } from 'primeng/select';
import { InputMaskModule } from 'primeng/inputmask';
import { ApiClient } from '../../core/http/api-client.service';
import {AuthApi} from './auth.api';
import {RegisterPayload, Role} from './auth.types';
import {AuthStore} from '../../core/auth/auth.store';
import {catchError, of, switchMap, tap} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  standalone: true,
  selector: 'auth-page',
  imports: [
    CommonModule, FormsModule,
    InputTextModule, PasswordModule, ButtonModule, CardModule,
    DividerModule, CheckboxModule, DialogModule, ProgressBarModule,
    ToastModule, InputGroup, InputGroupAddon, Select, InputMaskModule
  ],
  providers: [MessageService],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
class AuthPage {
  // login model
  email = '';
  password = '';
  remember = true;

  // registration model
  registerMode = false;
  passwordConfirm = '';
  fullName = '';
  phone: string | null = null;
  role: Exclude<Role, 'site_admin'> | '' = 'user';
  imageId: number | null = null;
  readonly roles = [
    { label: 'Пользователь', value: 'user' },
    { label: 'Админ центра', value: 'center_admin' },
  ];

  resetOpen = false;
  resetEmail = '';

  pwStrength = { value: 0, label: '', class: '' };

  constructor(private toast: MessageService, private api: ApiClient, private auth: AuthApi, private store: AuthStore, private router: Router) {}

  onPasswordChange(val: string) {
    const v = val ?? '';
    // простая эвристика силы: длина + типы символов
    let score = 0;
    if (v.length >= 8) score += 30;
    if (/[A-Z]/.test(v)) score += 20;
    if (/[a-z]/.test(v)) score += 20;
    if (/\d/.test(v)) score += 15;
    if (/[^A-Za-z0-9]/.test(v)) score += 15;
    score = Math.min(100, score);

    this.pwStrength.value = score;
    if (score >= 80) {
      this.pwStrength.label = 'Отличный пароль';
      this.pwStrength.class = 'good';
    } else if (score >= 50) {
      this.pwStrength.label = 'Средняя надёжность';
      this.pwStrength.class = 'medium';
    } else {
      this.pwStrength.label = 'Слабоват — добавьте символы Aa1!';
      this.pwStrength.class = 'weak';
    }
  }

  submitLogin() {
    const email = (this.email || '').trim();
    const password = this.password || '';
    if (!email || !password) {
      this.toast.add({ severity: 'warn', summary: 'Вход', detail: 'Введите email и пароль.' });
      return;
    }

    this.auth.login({ email, password }).pipe(
      tap(res => { console.debug('[login ok]', res); this.store.setTokens(res); }),
      switchMap(() => { console.debug('[profile call]'); return this.auth.profile(); }),
      tap(profile => { console.debug('[profile ok]', profile); this.store.setUser(profile); }),
      catchError(err => {
        console.debug('[profile err]', err);
        this.toast.add({ severity: 'warn', summary: 'Профиль', detail: 'Не удалось получить профиль.' });
        return of(null);
      })
    ).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Вход', detail: 'Готово ✅' });
        const params = new URLSearchParams(location.search);
        const returnUrl = params.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Вход', detail: 'Неверный email или пароль.' });
      }
    });
  }


  private validateRegister(): string[] {
    const errors: string[] = [];
    const email = (this.email || '').trim();
    const fullName = (this.fullName || '').trim();
    const phone = (this.phone ?? '').toString().trim();

    // email
    if (!email) errors.push('Email обязателен.');
    if (email && email.length > 254) errors.push('Email слишком длинный (до 254 символов).');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (email && !emailRe.test(email)) errors.push('Некорректный формат email.');

    // passwords
    if (!this.password) errors.push('Пароль обязателен.');
    if (!this.passwordConfirm) errors.push('Подтверждение пароля обязательно.');
    if (this.password && this.passwordConfirm && this.password !== this.passwordConfirm) {
      errors.push('Пароли не совпадают.');
    }

    // full name
    if (!fullName) errors.push('ФИО обязательно.');
    if (fullName && fullName.length > 255) errors.push('ФИО слишком длинное (до 255 символов).');

    // phone optional, <=32
    if (phone) {
      if (phone.length > 32) errors.push('Телефон слишком длинный (до 32 символов).');
    }

    // role (enum) — необязательное, но если указано, то должно быть валидным
    const allowedRoles = ['site_admin', 'center_admin', 'user'];
    if (this.role && !allowedRoles.includes(this.role)) {
      errors.push('Выберите корректную роль.');
    }

    return errors;
  }

  private showErrors(errors: string[]) {
    for (const e of errors) {
      this.toast.add({ severity: 'error', summary: 'Ошибка', detail: e });
    }
  }

  submitRegister() {
    const errors = this.validateRegister();
    if (errors.length) {
      this.showErrors(errors);
      return;
    }

    // нормализуем телефон: только цифры (если пусто — null)
    const rawPhone = (this.phone ?? '').toString();
    const normalizedPhone = rawPhone.replace(/\D/g, '');
    const phone = normalizedPhone || null;

    const payload: RegisterPayload = {
      email: this.email.trim(),
      password: this.password,
      password_confirm: this.passwordConfirm,
      full_name: this.fullName.trim(),
      phone,
      role: (this.role as Role) || null,
      image_id: this.imageId ?? null,
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Успех', detail: 'Аккаунт создан. Теперь войдите.' });
        this.registerMode = false;
        this.password = '';
        this.passwordConfirm = '';
      },
      error: (err) => {
        this.toast.add({ severity: 'error', summary: 'Регистрация', detail: 'Не удалось создать аккаунт.' });
        console.log(err)
      }
    });
  }

  openReset() {
    this.resetEmail = this.email || '';
    this.resetOpen = true;
  }

  sendReset() {
    this.resetOpen = false;
    this.toast.add({ severity: 'success', summary: 'Письмо отправлено', detail: 'Ссылка для сброса пароля отправлена (мок).' });
  }

  social(provider: 'Google' | 'Telegram') {
    this.toast.add({ severity: 'warn', summary: provider, detail: 'Соц-логин пока заглушка.' });
  }
}

export default AuthPage
