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
        path: 'data',
        loadComponent: () => import('../data/data.component'),
    },
];
