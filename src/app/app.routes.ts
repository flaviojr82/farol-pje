import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'automacoes', pathMatch: 'full' },
  {
    path: 'automacoes',
    loadComponent: () => import('./pages/automacoes/automacoes.component').then(m => m.AutomacoesComponent)
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent)
  },
  { path: '**', redirectTo: 'automacoes' }
];
