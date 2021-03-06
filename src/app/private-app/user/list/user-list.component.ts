import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { MatSnackBar, MatSnackBarConfig } from "@angular/material";

import * as Papa from "papaparse";

import { UserId, UserWithoutPassword, prettyUserPrivilegesLevel, isAboveMinimumPrivilege, UserPrivileges } from '../../../../common/user';
import { PhoneNumber } from "../../../../common/text";
import { UserService } from "../../../core/services/user.service";
import { DataService } from "../../../core/services/data.service";

const DEFAULT_SNACKBAR_CONFIG = new MatSnackBarConfig();
DEFAULT_SNACKBAR_CONFIG.duration = 5000;

function UsernameToEmail(username: String) {
  return username + "@st-andrews.ac.uk";
}
const IMPORT_USERNAME = "SaintMail";
const IMPORT_NAME = "Name";
const IMPORT_PHONE = "Mobile Number";
const IMPORT_ROLE = "Position";

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: UserWithoutPassword[];
  username: FormControl;
  name: FormControl;
  email: FormControl;
  phone: FormControl;
  role: FormControl;
  form: FormGroup;
  privilegesEnum = UserPrivileges;
  selectedLevel: UserPrivileges = UserPrivileges.VIEW_ONLY;
  currentlyEditingUser: UserWithoutPassword;

  bulkUsers: UserWithoutPassword[];

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loadUsers();
  }

  prettyLevelName(level) {
    return prettyUserPrivilegesLevel(Number(level));
  }

  loadUsers() {
    this.dataService.getUsersFromBackend()
    .then(users => this.users = users);
  }

  resetPassword(user: UserWithoutPassword) {
    this.dataService.resetUserPassword(user)
    .then(res => {
      this.snackBar.open(`Reset password for ${user.name}`, undefined, DEFAULT_SNACKBAR_CONFIG);
    })
  }

  ngOnInit() {
    this.username = new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)]));
    this.name= new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)]));
    this.email= new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)]));
    this.phone= new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)]));
    this.role = new FormControl('', Validators.maxLength(64));

    this.form = new FormGroup({
      'username': this.username,
      'name': this.name,
      'email': this.email,
      'phone': this.phone,
      'role': this.role
    });
  }

  getLevelValue(e) {
    /*
     * Had strange bug where Angular thought that 'e' was undefined in the templating bit
     * so using this to get around
     */
    return e.key;
  }

  isLevelDisabled(e) {
    let level = e.key
    let b = Number(level) == UserPrivileges.SUPERUSER;
    return b ? true : null;
  }

  deleteUser(username: UserId) {
    this.dataService.deleteUser(username)
    .then(() => {
      this.loadUsers();
      this.snackBar.open(`Deleted user ${username}`, undefined, DEFAULT_SNACKBAR_CONFIG);
    })
  }

  isEditingUser(user) {
    return user == this.currentlyEditingUser;
  }

  editUser(user) {
    this.currentlyEditingUser = user;
  }

  stopEditingUser() {
    this.currentlyEditingUser = undefined;
  }

  saveUser() {
    this.dataService.updateUser(this.currentlyEditingUser)
    .then(success => {
      this.snackBar.open(`Saved user details`, undefined, DEFAULT_SNACKBAR_CONFIG)
      this.stopEditingUser()
      this.loadUsers();
    });
  }

  canModify(user: UserWithoutPassword) {
    if (user.username == 'admin') return false;
    let me = this.userService.getUser();
    let check = isAboveMinimumPrivilege(UserPrivileges.MODIFY_ALL);
    return check(me.level);
  }

  createUser(user: UserWithoutPassword) {
    console.log('createUser(', user, ')')
    return this.dataService.createUser(user)
    .then(res => {
      this.loadUsers();
      this.form.reset();
      this.snackBar.open('Created user!', undefined, DEFAULT_SNACKBAR_CONFIG);
    })
    .catch(err => {
      console.log(err);
    });
  }

  onSubmit() {
    let formValue = this.form.value;
    formValue.level = this.selectedLevel;
    return this.createUser(formValue);
  }

  bulkRegisterFileEvent(fileInputEvent: any) {
    let fileInput = fileInputEvent.srcElement;
    let file = fileInput.files[0];
    let reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      console.log('FileUpload onload', event);
      let reader = <FileReader> event.target;
      if (reader.error) {
        console.error('error reading file!');
        return;
      }
      let textContent = reader.result;
      let bulkData = Papa.parse(textContent, {
        header: true
      });
      this.bulkUsers = [];
      console.log(bulkData)
      bulkData.data.forEach(row => {
        this.bulkUsers.push({
          username: row[IMPORT_USERNAME],
          name: row[IMPORT_NAME],
          email: UsernameToEmail(row[IMPORT_USERNAME]),
          phone: PhoneNumber.parse(row[IMPORT_PHONE]),
          role: row[IMPORT_ROLE],
          level: UserPrivileges.VIEW_ONLY
        })
      })
    }

    reader.readAsText(file);
  }

  usernameExists(username: string) {
    return !!this.users.filter(user => user.username === username).length;
  }
}
