import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { ROUTES } from './app.routes';

import { RacetrackMaterialModule } from "./racetrack.material.module";

import { AppComponent } from './app.component';
import { PublicAppComponent } from './public-app'

@NgModule({
  declarations: [
    AppComponent,
    PublicAppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    })
    RacetrackMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
