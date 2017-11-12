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

import { LocationWidget } from './widgets/location';
import { PhoneWidget } from './widgets/phone';
import { TextWidget } from './widgets/text';
import { TimeWidget } from './widgets/time';
import { UserWidget } from './widgets/user';

import { KeysPipe, OrderByPipe, TeamHasUpdatePipe } from './pipes';
import { AuthenticatedGuard, UnauthenticatedGuard, PasswordResetGuard } from './guards';
import { UserService, TextService, DataService, NominatimService } from './services';

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
