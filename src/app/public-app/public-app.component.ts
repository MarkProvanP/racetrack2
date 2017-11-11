import { Component, ViewEncapsulation } from '@angular/core';
import { Title } from "@angular/platform-browser";
//import { UserService } from '../services/user.service';
//import { DataService } from '../services/data.service';

@Component({
  selector: 'public-app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './public-app.component.scss'
  ],
  templateUrl: './public-app.component.html'
})
export class PublicAppComponent {
  recentTextsReceived = [];

  constructor(
    private titleService: Title,
    //private userService: UserService,
    //private dataService: DataService
  ) {}
}

