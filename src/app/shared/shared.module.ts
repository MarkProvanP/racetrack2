import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RacetrackMaterialModule } from "../racetrack.material.module";

import { LocationWidget } from './widgets/location';
import { PhoneWidget } from './widgets/phone';
import { TextWidget } from './widgets/text';
import { TimeWidget } from './widgets/time';
import { UserWidget } from './widgets/user';

import { KeysPipe, OrderByPipe, TeamHasUpdatePipe } from './pipes';

@NgModule({
    imports: [
        CommonModule,
        RacetrackMaterialModule,     
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        LocationWidget,
        PhoneWidget,
        TextWidget,
        TimeWidget,
        UserWidget,
        KeysPipe,
        OrderByPipe,
        TeamHasUpdatePipe
    ],
    exports: [
        CommonModule,
        LocationWidget,
        PhoneWidget,
        TextWidget,
        TimeWidget,
        UserWidget,
        KeysPipe,
        OrderByPipe,
        TeamHasUpdatePipe,
        FormsModule,
        ReactiveFormsModule,
        RacetrackMaterialModule
    ]
})
export class SharedModule {

}