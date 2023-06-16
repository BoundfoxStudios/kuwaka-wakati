import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard',
    },
    {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard.component'),
    },
    {
        path: 'times',
        loadComponent: () => import('../times/times.component'),
    },
    {
        path: 'settings',
        loadComponent: () => import('../settings/settings.component'),
    },
];
