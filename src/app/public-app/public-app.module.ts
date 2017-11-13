import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';

import { SharedModule } from '../shared';
import { PublicAppRoutingModule } from './public-app-routing.module';

import { PublicAppComponent } from './public-app.component';
import { PublicMapComponent } from './public-map';
import { LoginComponent } from './login';

@NgModule({
    imports: [
        SharedModule,
        PublicAppRoutingModule,
        AgmCoreModule,
    ],
    declarations: [
        PublicAppComponent,
        PublicMapComponent,
        LoginComponent
    ]
})
export class PublicAppModule {

}