import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'signalements', pathMatch: 'full' },
  {
    path: 'signalements',
    loadComponent: () =>
      import('./features/signalements/signalement-list/signalement-list.component').then(
        (m) => m.SignalementListComponent,
      ),
  },
  {
    path: 'signalements/new',
    loadComponent: () =>
      import('./features/signalements/signalement-form/signalement-form.component').then(
        (m) => m.SignalementFormComponent,
      ),
  },
  {
    path: 'signalements/:id/edit',
    loadComponent: () =>
      import('./features/signalements/signalement-form/signalement-form.component').then(
        (m) => m.SignalementFormComponent,
      ),
  },
];
