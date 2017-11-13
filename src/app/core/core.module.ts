import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AuthenticatedGuard, UnauthenticatedGuard, PasswordResetGuard } from './guards';
import { UserService, TextService, DataService, NominatimService } from './services';

@NgModule({
    imports: [
        CommonModule,
        HttpModule
    ],
    providers: [
        AuthenticatedGuard,
        UnauthenticatedGuard,
        PasswordResetGuard,
        UserService,
        TextService,
        DataService,
        NominatimService
    ]
})
export class CoreModule {

}