import { Routes } from '@angular/router';
import { ShellComponent } from './shared/layout/shell.component';
import {authGuard} from './core/auth/auth.guard';
import {guestGuard} from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.page').then(m => m.HomePage) },
      {
        path: 'centers',
        loadComponent: () => import('./features/centers/centers.page').then(m => m.CentersPage),
        canMatch: [authGuard],
      },
      {
        path: 'centers/:id',
        loadComponent: () => import('./features/center-detail/center-detail.page').then(m => m.CenterDetailPage),
        canMatch: [authGuard],
      },
      {
        path: 'programs',
        loadComponent: () => import('./features/programs/programs.page').then(m => m.ProgramsPage),
        canMatch: [authGuard],
      },
      {
        path: 'lecturers',
        loadComponent: () => import('./features/lecturers/lecturers.page').then(m => m.LecturersPage),
        canMatch: [authGuard],
      },
      { path: 'faq', loadComponent: () => import('./features/faq/faq.page').then(m => m.FaqPage) },
      {
        path: 'auth',
        loadComponent: () => import('./features/auth/auth.page').then(m => m.default),
        canMatch: [guestGuard],
      },
      {
        path: 'lecturers/:id',
        loadComponent: () =>
          import('./features/lecturer-detail/lecturer-detail.page').then(m => m.LecturerDetailPage),
        canMatch: [authGuard],
      },
      {
        path: 'programs/:id',
        loadComponent: () =>
          import('./features/program-detail/program-detail.page').then(m => m.ProgramDetailPage),
        canMatch: [authGuard],
      },
      {
        path: 'news/:id',
        loadComponent: () => import('./features/news-details/news-detail.page').then(m => m.NewsDetailPage),
        canMatch: [authGuard],
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.page').then(m => m.ProfilePage),
        canMatch: [authGuard],
      },
    ]
  },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.page').then(m => m.NotFoundPage) }
];
