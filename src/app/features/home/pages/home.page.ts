import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { DrawerModule } from 'primeng/drawer';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  standalone: true,
  selector: 'home-page',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    InputGroupModule,
    CardModule,
    ChipModule,
    TagModule,
    AvatarModule,
    SkeletonModule,
    DrawerModule,
    ScrollTopModule,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  queryValue = '';
  currentYear = new Date().getFullYear();

  isDark = signal<boolean>(false);

  // состояние
  loading = signal(false);
  mobileOpen = false;

  centers = signal([
    { id: 1, name: 'Energy Academy', city: 'Астана', programs: 12 },
    { id: 2, name: 'Power Learn', city: 'Алматы', programs: 8 },
    { id: 3, name: 'HeatTech School', city: 'Шымкент', programs: 5 },
  ]);

  programs = signal([
    { id: 11, title: 'Теплотехника базовый', price: 120000, center: 'Energy Academy', lecturer: 'И. Смагулов' },
    { id: 12, title: 'Электроэнергетика: релейка', price: 150000, center: 'Power Learn', lecturer: 'А. Омаров' },
    { id: 13, title: 'Охрана труда на ТЭЦ', price: 90000, center: 'HeatTech School', lecturer: 'Н. Алиев' },
  ]);

  lecturers = signal([
    { id: 21, name: 'Искандер Смагулов', role: 'Теплотехника' },
    { id: 22, name: 'Айдар Омаров', role: 'Релейная защита' },
    { id: 23, name: 'Нурлан Алиев', role: 'Охрана труда' },
  ]);

  constructor(private readonly router: Router) {
    // инициализация из localStorage / DOM
    if (typeof document !== 'undefined') {
      const stored = localStorage.getItem('theme');
      const hasClass = document.documentElement.classList.contains('app-dark');
      const startDark = stored ? stored === 'dark' : hasClass;
      this.applyDark(startDark);
    }
  }
  // навигация
  goCenters()   { this.router.navigateByUrl('/centers'); }
  goPrograms()  { this.router.navigateByUrl('/programs'); }
  goLecturers() { this.router.navigateByUrl('/lecturers'); }
  openCenter(id: number)  { this.router.navigate(['/centers', id]); }
  openProgram(id: number) { this.router.navigate(['/programs', id]); }

  // заглушки под вызовы из шаблона
  setLang(lang: 'ru' | 'kk') {
    // сюда можно подключить ngx-translate/PrimeNGConfig.setTranslation(...)
    console.log('setLang:', lang);
  }
  filterByCity(city: string) { console.log('filterByCity:', city); }

  // UI helpers
  toggleMobile() { this.mobileOpen = !this.mobileOpen; }

  private applyDark(enable: boolean) {
    if (typeof document === 'undefined') return;
    this.isDark.set(enable);
    document.documentElement.classList.toggle('app-dark', enable);
    localStorage.setItem('theme', enable ? 'dark' : 'light');
  }

  toggleTheme() {
    this.applyDark(!this.isDark());
  }

}
