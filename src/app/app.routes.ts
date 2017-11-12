import { Routes } from '@angular/router';

import { PublicAppComponent } from './public-app';
import { PublicMapComponent } from './public-app/public-map'
import { LoginComponent } from './public-app/login';

import { PrivateAppComponent } from './private-app';
import { DashboardComponent } from './private-app/dashboard';
import { SafetyMapComponent } from './private-app/safety-map';
import { TextsComponent } from './private-app/texts';
import { AllTextsComponent } from './private-app/texts/all-texts';
import { AddNonNativeTextComponent } from './private-app/texts/non-native';
import { RacerTextsComponent } from './private-app/texts/racer-texts';
import { TeamTextsComponent } from './private-app/texts/team-texts';
import { TextSendComponent } from './private-app/texts/text-send';
import { TextsListComponent } from './private-app/texts/texts-list';
import { UpdatesComponent } from './private-app/updates';
import { UserListComponent } from './private-app/user/list';
import { LogoutComponent } from './private-app/user/logout';
import { MeComponent } from './private-app/user/me';
import { SetPasswordComponent } from './private-app/user/set-password';

import { AuthenticatedGuard, UnauthenticatedGuard, PasswordResetGuard } from './guards';

export const ROUTES: Routes = [
  {
    path: 'safetyteam',
    component: PrivateAppComponent,
    canActivate: [AuthenticatedGuard, PasswordResetGuard],
    children: [
      {
        path: 'texts',
        component: TextsComponent,
        children: [
          { path: '', redirectTo: 'all', pathMatch: 'full'},
          { 
            path: 'all',
            children: [
              { path: '', component: AllTextsComponent },
              { path: 'unread', component: AllTextsComponent }
            ]
          },
          {
            path: 'by-racer',
            children: [
              { path: '', component: RacerTextsComponent },
              { path: ':id', component: RacerTextsComponent }
            ]
          },
          { 
            path: 'by-team',
            children: [
              { path: '', component: TeamTextsComponent },
              { path: ':id', component: TeamTextsComponent }
            ]
          },
          {
            path: 'non-native', component: AddNonNativeTextComponent
          }
        ]
      },
      {
        path: 'updates',
        children: [
          { path: '', component: UpdatesComponent },
          { path: ':id', component: UpdatesComponent }
        ]
      },
      {
        path: 'user', children: [
          { path: 'logout', component: LogoutComponent },
          { path: 'me', component: MeComponent },
          { path: 'list', component: UserListComponent },
        ]
      },
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
