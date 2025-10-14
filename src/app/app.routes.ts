import { Routes } from '@angular/router';
import { ShellComponent } from './shared/layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.page').then(m => m.HomePage) },
      { path: 'centers', loadComponent: () => import('./features/centers/centers.page').then(m => m.CentersPage) },
      { path: 'centers/:id', loadComponent: () => import('./features/center-detail/center-detail.page').then(m => m.CenterDetailPage) },
      { path: 'programs', loadComponent: () => import('./features/programs/programs.page').then(m => m.ProgramsPage) },
      { path: 'lecturers', loadComponent: () => import('./features/lecturers/lecturers.page').then(m => m.LecturersPage) },
      { path: 'auth', loadComponent: () => import('./features/auth/auth.page').then(m => m.AuthPage) },
    ]
  },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.page').then(m => m.NotFoundPage) }
];
