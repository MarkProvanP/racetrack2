import { Routes } from '@angular/router';

import { PublicAppComponent } from './public-app';
import { PublicMapComponent } from './public-app/public-map'

export const ROUTES: Routes = [
  {
    path: '',
    component: PublicAppComponent,
    children: [
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
