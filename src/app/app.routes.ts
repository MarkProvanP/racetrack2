import { Routes } from '@angular/router';

import { PublicAppComponent } from './public-app';
import { PublicMapComponent } from './public-app/public-map'
import { LoginComponent } from './public-app/login';

import { PrivateAppComponent } from './private-app';
import { DashboardComponent } from './private-app/dashboard';
import { SafetyMapComponent } from './private-app/safety-map';

import { AuthenticatedGuard, UnauthenticatedGuard, PasswordResetGuard } from './guards';

export const ROUTES: Routes = [
  {
    path: 'safetyteam',
    component: PrivateAppComponent,
    canActivate: [AuthenticatedGuard, PasswordResetGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'map', component: SafetyMapComponent },
      { path: '', redirectTo: '/safetyteam/dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: PublicAppComponent,
    canActivate: [UnauthenticatedGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '',
        children: [
          {
            path: '',
            component: PublicMapComponent
          },
          {
            path: 'track/:id',
            component: PublicMapComponent
          }
        ]
      },
      {
        path: '**', redirectTo: '/', pathMatch: 'full'
      }
    ]
  }
]
