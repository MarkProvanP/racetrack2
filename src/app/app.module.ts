import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from "@agm/core";
import { PushNotificationsModule } from "ng-push";

import { ROUTES } from './app.routes';
import { RacetrackMaterialModule } from "./racetrack.material.module";

import { AppComponent } from './app.component';

import { PublicAppComponent } from './public-app';
import { PublicMapComponent } from './public-app/public-map';
import { LoginComponent } from './public-app/login';

import { PrivateAppComponent } from './private-app';
import { DashboardComponent } from './private-app/dashboard';
import { DashboardCardComponent } from './private-app/dashboard/dashboard-card';
import { SafetyMapComponent } from './private-app/safety-map';
import { TextsComponent } from './private-app/texts';
import { AllTextsComponent } from './private-app/texts/all-texts';
import { AddNonNativeTextComponent } from './private-app/texts/non-native';
import { RacerTextsComponent } from './private-app/texts/racer-texts';
import { TeamTextsComponent } from './private-app/texts/team-texts';
import { TextSendComponent } from './private-app/texts/text-send';
import { TextsListComponent } from './private-app/texts/texts-list';
import { AppTextComponent } from './private-app/texts/texts-list/app-text';
import { NonNativeTextComponent } from './private-app/texts/texts-list/non-native-text';
import { NormalTextComponent } from './private-app/texts/texts-list/normal-text';
import { SentTextComponent } from './private-app/texts/texts-list/sent-text';
import { UnknownTextComponent } from './private-app/texts/texts-list/unknown-text';
import { UpdatesComponent } from './private-app/updates';
import { NewUpdateComponent } from './private-app/updates/new-update';
import { UserListComponent } from './private-app/user/list';
import { LogoutComponent } from './private-app/user/logout';
import { MeComponent } from './private-app/user/me';
import { SetPasswordComponent } from './private-app/user/set-password';
import { RacersComponent } from './private-app/racers';
import { RacerCardComponent } from './private-app/racers/racer-card';
import { NoRacerComponent } from './private-app/racers/no-racer';
import { TeamsComponent } from './private-app/teams';
import { TeamCardComponent } from './private-app/teams/team-card';
import { NoTeamComponent } from './private-app/teams/no-team';
import { ImportComponent } from './private-app/import';
import { MassTextComponent } from './private-app/mass-text';
import { DebugComponent } from './private-app/misc/debug';

import { LocationWidget } from './shared/widgets/location';
import { PhoneWidget } from './shared/widgets/phone';
import { TextWidget } from './shared/widgets/text';
import { TimeWidget } from './shared/widgets/time';
import { UserWidget } from './shared/widgets/user';

import { KeysPipe, OrderByPipe, TeamHasUpdatePipe } from './shared/pipes';
import { AuthenticatedGuard, UnauthenticatedGuard, PasswordResetGuard } from './core/guards';
import { UserService, TextService, DataService, NominatimService } from './core/services';

import { environment } from '../environments/environment'

const GOOGLE_MAPS_API_KEY = environment.googleMapsApiKey;

@NgModule({
  declarations: [
    AppComponent,

    PublicAppComponent,
    PublicMapComponent,
    LoginComponent,

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

    LocationWidget,
    PhoneWidget,
    TextWidget,
    TimeWidget,
    UserWidget,
    KeysPipe,
    OrderByPipe,
    TeamHasUpdatePipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RacetrackMaterialModule,
    AgmCoreModule.forRoot({
      apiKey: GOOGLE_MAPS_API_KEY
    }),    
    PushNotificationsModule,
  ],
  providers: [
    AuthenticatedGuard,
    UnauthenticatedGuard,
    PasswordResetGuard,
    UserService,
    TextService,
    DataService,
    NominatimService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
