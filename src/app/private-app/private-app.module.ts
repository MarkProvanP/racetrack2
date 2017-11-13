import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';

import { SharedModule } from '../shared';
import { PrivateAppRoutingModule } from './private-app-routing.module';

import { PrivateAppComponent } from './private-app.component';
import { DashboardComponent } from './dashboard';
import { DashboardCardComponent } from './dashboard/dashboard-card';
import { SafetyMapComponent } from './safety-map';
import { TextsComponent } from './texts';
import { AllTextsComponent } from './texts/all-texts';
import { AddNonNativeTextComponent } from './texts/non-native';
import { RacerTextsComponent } from './texts/racer-texts';
import { TeamTextsComponent } from './texts/team-texts';
import { TextSendComponent } from './texts/text-send';
import { TextsListComponent } from './texts/texts-list';
import { AppTextComponent } from './texts/texts-list/app-text';
import { NonNativeTextComponent } from './texts/texts-list/non-native-text';
import { NormalTextComponent } from './texts/texts-list/normal-text';
import { SentTextComponent } from './texts/texts-list/sent-text';
import { UnknownTextComponent } from './texts/texts-list/unknown-text';
import { UpdatesComponent } from './updates';
import { NewUpdateComponent } from './updates/new-update';
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

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        PrivateAppRoutingModule,
        AgmCoreModule,
        FormsModule
    ],
    declarations: [
        PrivateAppComponent,
        DashboardComponent,
        DashboardCardComponent,
        SafetyMapComponent,
        TextsComponent,
        AllTextsComponent,
        AddNonNativeTextComponent,
        RacerTextsComponent,
        TeamTextsComponent,
        TextSendComponent,
        TextsListComponent,
        AppTextComponent,
        NonNativeTextComponent,
        NormalTextComponent,
        NormalTextComponent,
        SentTextComponent,
        UnknownTextComponent,
        UpdatesComponent,
        NewUpdateComponent,
        UserListComponent,
        LogoutComponent,
        MeComponent,
        SetPasswordComponent,
        RacersComponent,
        RacerCardComponent,
        NoRacerComponent,
        TeamsComponent,
        TeamCardComponent,
        NoTeamComponent,
        ImportComponent,
        MassTextComponent,
        DebugComponent,
    ]
})
export class PrivateAppModule {

}