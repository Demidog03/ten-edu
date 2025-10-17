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
      { path: 'faq', loadComponent: () => import('./features/faq/faq.page').then(m => m.FaqPage) },
      { path: 'auth', loadComponent: () => import('./features/auth/auth.page').then(m => m.AuthPage) },
      {
        path: 'lecturers/:id',
        loadComponent: () =>
          import('./features/lecturer-detail/lecturer-detail.page').then(m => m.LecturerDetailPage)
      },
      {
        path: 'programs/:id',
        loadComponent: () =>
          import('./features/program-detail/program-detail.page').then(m => m.ProgramDetailPage)
      },
      { path: 'news/:id', loadComponent: () => import('./features/news-details/news-detail.page').then(m => m.NewsDetailPage) },
    ]
  },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.page').then(m => m.NotFoundPage) }
];
