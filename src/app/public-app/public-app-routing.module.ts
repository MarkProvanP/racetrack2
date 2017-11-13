import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnauthenticatedGuard } from '../core/guards';

import { PublicAppComponent } from './public-app.component';
import { PublicMapComponent } from './public-map'
import { LoginComponent } from './login';

const routes: Routes = [
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

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicAppRoutingModule {

}