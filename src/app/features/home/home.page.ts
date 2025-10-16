import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
import {DataService} from '../../shared/data.service'
import {Carousel} from 'primeng/carousel'

@Component({
  standalone: true,
  selector: 'home-page',
  imports: [
    CommonModule, FormsModule, RouterModule,
    MenubarModule, ButtonModule, DividerModule, InputTextModule, InputGroupModule,
    CardModule, ChipModule, TagModule, AvatarModule, SkeletonModule, DrawerModule, ScrollTopModule, Carousel,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  queryValue = '';
  mobileOpen = false;
  isDark = false;
  currentYear = new Date().getFullYear();

  loading = signal(false);

  constructor(private router: Router, public data: DataService) {
    const stored = localStorage.getItem('theme');
    this.isDark = stored === 'dark';
    document.documentElement.classList.toggle('app-dark', this.isDark);
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('app-dark', this.isDark);
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  toggleMobile() { this.mobileOpen = !this.mobileOpen; }

  goCenters() { this.router.navigateByUrl('/centers'); }
  goPrograms() {
    this.data.query.set(this.queryValue);
    this.router.navigateByUrl('/programs');
  }
  goLecturers() { this.router.navigateByUrl('/lecturers'); }

  centers() { return this.data.filteredCenters(); }
  programs() { return this.data.filteredPrograms(); }
  lecturers() { return this.data.lecturers(); }

  setLang(_lang: 'kk' | 'ru') {}
  filterByCity(city: string) { this.data.city.set(city); }

  openCenter(id: number)  { this.router.navigate(['/centers', id]); }
  openProgram(id: number) { this.router.navigate(['/programs', id]); }

  imgFallback(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#e8f5f3"/>
            <stop offset="1" stop-color="#d5eee9"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <g fill="#2d6a65" font-family="Inter, Arial" font-size="28" opacity="0.55">
          <text x="50%" y="50%" text-anchor="middle">Vista Expert</text>
        </g>
      </svg>
    `);
  }

  responsive = [
    { breakpoint: '960px', numVisible: 2, numScroll: 1 },
    { breakpoint: '640px', numVisible: 1, numScroll: 1 },
  ];

  news() { return this.data.news(); }

  goToNews() {
    this.router.navigate(['/news', 1]);
  }
}
