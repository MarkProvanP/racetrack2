import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from "@agm/core";
import { PushNotificationsModule } from "ng-push";

import { AppRoutingModule } from './app-routing.module';
import { RacetrackMaterialModule } from "./racetrack.material.module";

import { AppComponent } from './app.component';

import { SharedModule } from './shared';
import { CoreModule } from './core';

import { environment } from '../environments/environment'
const GOOGLE_MAPS_API_KEY = environment.googleMapsApiKey;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: GOOGLE_MAPS_API_KEY
    }),
    PushNotificationsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
