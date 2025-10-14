import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ScrollTopModule } from 'primeng/scrolltop';
import { DrawerModule } from 'primeng/drawer'; // +++

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [
    CommonModule, RouterModule,
    MenubarModule, ButtonModule, DividerModule, ScrollTopModule,
    DrawerModule, // +++
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  year = new Date().getFullYear();
  isDark = false;
  mobileOpen = false; // +++

  constructor(private router: Router) {
    const stored = localStorage.getItem('theme');
    const startDark = stored ? stored === 'dark' : document.documentElement.classList.contains('app-dark');
    this.applyDark(startDark);
  }

  go(url: string) { this.router.navigateByUrl(url); }
  toggleTheme() { this.applyDark(!this.isDark); }
  toggleMobile() { this.mobileOpen = !this.mobileOpen; } // +++

  private applyDark(enable: boolean) {
    this.isDark = enable;
    document.documentElement.classList.toggle('app-dark', enable);
    localStorage.setItem('theme', enable ? 'dark' : 'light');
  }
}
