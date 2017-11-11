import { Injectable } from "@angular/core";

import { Router, CanActivate } from "@angular/router";

import { UserService } from '../services/user.service';
import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class UnauthenticatedGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): Observable<boolean> | boolean {
    return this.userService.auth()
      .pipe(
        map(authenticated => {
          if (!authenticated.auth) {
            return true;
          } else {
            this.router.navigate(['/safetyteam']);
            return false;
          }}),
          catchError(error => of(true))
      )
  }
}
