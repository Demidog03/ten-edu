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
import {InputGroup} from 'primeng/inputgroup'
import {InputGroupAddon} from 'primeng/inputgroupaddon'

@Component({
  standalone: true,
  selector: 'auth-page',
  imports: [
    CommonModule, FormsModule,
    InputTextModule, PasswordModule, ButtonModule, CardModule,
    DividerModule, CheckboxModule, DialogModule, ProgressBarModule,
    ToastModule, InputGroup, InputGroupAddon
  ],
  providers: [MessageService],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage {
  email = '';
  password = '';
  remember = true;

  resetOpen = false;
  resetEmail = '';

  pwStrength = { value: 0, label: '', class: '' };

  constructor(private toast: MessageService) {}

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
    this.toast.add({ severity: 'success', summary: 'Вход', detail: 'Мок-вход выполнен ✅' });
  }

  submitRegister() {
    this.toast.add({ severity: 'info', summary: 'Регистрация', detail: 'Мок-регистрация: создадим аккаунт позже 😉' });
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
