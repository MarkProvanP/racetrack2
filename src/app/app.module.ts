import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AgmCoreModule } from "@agm/core";

import { ROUTES } from './app.routes';

import { RacetrackMaterialModule } from "./racetrack.material.module";

import { AppComponent } from './app.component';
import { PublicAppComponent } from './public-app';
import { PublicMapComponent } from './public-app/public-map';

import { LocationWidget } from './widgets/location';
import { PhoneWidget } from './widgets/phone';
import { TextWidget } from './widgets/text';
import { TimeWidget } from './widgets/time';
import { UserWidget } from './widgets/user';

import { KeysPipe, OrderByPipe, TeamHasUpdatePipe } from './pipes';

import { UserService, TextService, DataService } from './services';

import { environment } from '../environments/environment'

const GOOGLE_MAPS_API_KEY = environment.googleMapsApiKey;

@NgModule({
  declarations: [
    AppComponent,
    PublicAppComponent,
    PublicMapComponent,
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
    RacetrackMaterialModule,
    AgmCoreModule.forRoot({
      apiKey: GOOGLE_MAPS_API_KEY
    }),    
  ],
  providers: [
    UserService,
    TextService,
    DataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
