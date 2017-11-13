import { Component, ViewEncapsulation } from '@angular/core';
import { Title } from "@angular/platform-browser";
//import { UserService } from '../shared/services/user.service';
//import { DataService } from '../shared/services/data.service';

import { environment } from '../../environments/environment'

const APP_NAME = environment.appName;

@Component({
  selector: 'public-app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './public-app.component.scss'
  ],
  templateUrl: './public-app.component.html'
})
export class PublicAppComponent {
  name = APP_NAME;
  recentTextsReceived = [];

  constructor(
    private titleService: Title,
    //private userService: UserService,
    //private dataService: DataService
  ) {}
}

