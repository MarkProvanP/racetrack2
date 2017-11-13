import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticatedGuard, PasswordResetGuard } from '../core/guards';

import { PrivateAppComponent } from './private-app.component';
import { DashboardComponent } from './dashboard';
import { SafetyMapComponent } from './safety-map';
import { TextsComponent } from './texts';
import { AllTextsComponent } from './texts/all-texts';
import { AddNonNativeTextComponent } from './texts/non-native';
import { RacerTextsComponent } from './texts/racer-texts';
import { TeamTextsComponent } from './texts/team-texts';
import { TextSendComponent } from './texts/text-send';
import { TextsListComponent } from './texts/texts-list';
import { UpdatesComponent } from './updates';
import { UserListComponent } from './user/list';
import { LogoutComponent } from './user/logout';
import { MeComponent } from './user/me';
import { SetPasswordComponent } from './user/set-password';
import { RacersComponent } from './racers';
import { RacerCardComponent } from './racers/racer-card';
import { NoRacerComponent } from './racers/no-racer';
import { TeamsComponent } from './teams';
import { TeamCardComponent } from './teams/team-card';
import { NoTeamComponent } from './teams/no-team';
import { ImportComponent } from './import';
import { MassTextComponent } from './mass-text';
import { DebugComponent } from './misc/debug';

const routes: Routes = [
    {
        path: '',
        component: PrivateAppComponent,
        canActivate: [AuthenticatedGuard, PasswordResetGuard],
        children: [
            {
                path: 'set-password',
                canActivate: [AuthenticatedGuard],
                component: SetPasswordComponent
            },
            {
                path: 'texts',
                component: TextsComponent,
                children: [
                    { path: '', redirectTo: 'all', pathMatch: 'full' },
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
                path: 'racers',
                component: RacersComponent,
                children: [
                    { path: '', component: NoRacerComponent },
                    { path: ':id', component: RacerCardComponent },
                    { path: ':id/edit', component: RacerCardComponent }
                ]
            },
            {
                path: 'teams',
                component: TeamsComponent,
                children: [
                    { path: '', component: NoTeamComponent },
                    { path: ':id', component: TeamCardComponent },
                    { path: ':id/edit', component: TeamCardComponent }
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
            { path: 'mass-text', component: MassTextComponent },
            { path: 'debug', component: DebugComponent },
            { path: 'import', component: ImportComponent },
            { path: '', redirectTo: '/safetyteam/dashboard', pathMatch: 'full' }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivateAppRoutingModule {

}