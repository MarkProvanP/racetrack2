import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'safetyteam', loadChildren: 'app/private-app/private-app.module#PrivateAppModule'},
    { path: '', loadChildren: 'app/public-app/public-app.module#PublicAppModule'}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}