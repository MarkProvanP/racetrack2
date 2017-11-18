# Racetrack2

Software to manage Race2 or some other Jailbreak-style event with text messages etc

Built to be put on Heroku, using Twilio for inbound and outbound text messaging services

## TODO since last year

- [x] Get app running again with newer versions of dependencies and libraries
- [x] Move from angular2-starter to Angular CLI for app structure 
- [x] Modularise Angular code to allow lazy loading (i.e. only safety team members load safety team code)
- [x] Split up backend code into semi-sensible modules
- [x] Fix public map design on mobile
- [x] Fix app sizing/layout/scrolling for safety team and make basic layout styles modular
- [x] Use Material components for import component
- [ ] **Renew race2.org.uk domain and re-activate HTTPS before race!**
- [ ] Clean up and make import component configurable for different races
- [ ] Add text replay/safety team training mode
- [ ] Add proper social media integration for racers - auto posting etc
- [ ] Make application assets configurable outside of code - e.g. graphics, themes, map posititions
- [ ] Add automatic import of team starting locations
- [ ] Redo data system to reduce need for backend calls
- [ ] Add fine-grained permission and auditing system for safety team
- [ ] Move to base64 encoded map pin data retrieved with other data rather than 64 separate HTTP requests

## Configuration

Configuration is done through environment variables
NOTE: For variables to be exposed in Angular land, they must be preceded by `NG_`, and will be available `in environment.ts` in camelCase after running `npm run ng-environment`
e.g. `NG_GOOGLE_MAPS_API_KEY` is available as `environment.googleMapsApiKey`

` NG_APP_NAME ` - Name for app/event, e.g. "Race2 Barcelona"

` NG_GOOGLE_MAPS_API_KEY ` - API key for Google Maps

` APP_URL ` - URL for app

` DATA_EMAIL_RECIPIENTS ` - Comma-separated list of email addresses where emails for data should be sent (e.g. when text sent or received)

` ERROR_EMAIL_RECIPIENTS ` - Comma-separated list of email addresses where error emails should be sent

` STATUS_EMAIL_RECIPIENTS ` - Comma-separated list of email addresses where status updates should be sent (e.g. server now running)

` GMAIL_CLIENT_ID ` - OAuth2 Client ID for app Gmail account

` GMAIL_CLIENT_SECRET ` - OAuth2 Client Secret for app Gmail account

` GMAIL_REFRESH_TOKEN ` - OAuth2 Refresh Token for app Gmail account

` GMAIL_USER ` - Gmail email address for app

` MONGODB_URI ` - URI for MongoDB database

` RACE2_ADMIN_PASSWORD ` - Password for app 'admin' superuser

` TWILIO_AUTH_TOKEN ` - Twilio Auth Token

` TWILIO_SENDING_NO ` - Full Twilio number (e.g. +4401234 567890)

` TWILIO_SID ` - Twilio SID

` TWILIO_SMS_WEBHOOK` - Twilio webhook URL for receiving texts

HTTPS support is included when the ` HTTPS_FORCE ` env variable is set (to anything, even `false` - it must be the empty string or non-existent to be false - the wonders of JavaScript...).
When set, when the application detects that it is running on Heroku it will force all HTTP requests to be redirected to HTTPS,
and will trust the `X-Forwarded-Proto` header as this is Heroku's proxy server.
Also included is a mechanism to load up ACME challenge-response pairs, using a JSON-encoded array of `{request: "/.well-known/bleh", response: "keyboard-cat"}` objects as the `ACME_CHALLENGES` environment variable.
http://collectiveidea.com/blog/archives/2016/01/12/lets-encrypt-with-a-rails-app-on-heroku


## Development
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Add `--proxy-config proxy.conf.json` for Angular CLI to proxy backend API requests through to an separate backend instance running locally on `localhost:5000`

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

