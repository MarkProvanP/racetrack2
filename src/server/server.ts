import {
  APP_NAME,
  APP_URL,
  HOSTNAME,
  PORT,
  MONGODB_URI,
  TWILIO_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SENDING_NO,
  TWILIO_SMS_WEBHOOK,
  RACE2_ADMIN_PASSWORD,
  GMAIL_USER,
  ON_HEROKU,
  HTTPS_FORCE
} from './constants';

import * as express from "express";
let app = express();

let forceSSL = require("express-force-ssl");
if (ON_HEROKU && HTTPS_FORCE) {
  console.log("Running on Heroku, requiring SSL")
  app.use(forceSSL);
  app.set('forceSSLOptions', {
    trustXFPHeader: true
  })
} else {
  console.log("Not running on Heroku, not requiring SSL");
}

import * as winston from "winston";
winston.add(winston.transports.File, { filename: 'logfile.log' })

let http = require('http').Server(app);
import * as socketio from 'socket.io';
let io = socketio(http);
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
import * as expressSession from 'express-session';
const MongoStore = require('connect-mongo')(expressSession);
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as twilio from 'twilio';

if (!RACE2_ADMIN_PASSWORD) {
  console.error("RACE2_ADMIN_PASSWORD environment variable must be set before use!");
  process.exit(1);
}

let twilioClient: twilio.RestClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

import { UserPrivileges, UserId } from "../common/user";
import { Racer } from '../common/racer';
import { Team } from '../common/team';
import { Text, TwilioInboundText, TwilioOutboundText } from "../common/text";

var path = require('path');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());

import { letsEncryptHandler } from './lets-encrypt-handler';
letsEncryptHandler(app);

const SESSION_SECRET = 'kewbfklebhfrhaewbfabfjbhzsfkjbkasjbvhkjaswbhdrvfkashbfvhavfha';
const SESSION_KEY = "express.sid";

import { UserWithoutPassword } from "../common/user";

import { SavedConfig, GetDataIntermediary } from "./data-intermediate";
import { DbFacadeInterface } from './db/db-facade';
import { setup } from './db/mongo-db-facade';


let dataIntermediate;

import { Emailer } from './emailer';

let emailer = new Emailer();

import { newlineReplace } from './utils';


import { MessageSender } from './message-sender';

let messageSender = new MessageSender();

import { socialMediaBotMiddleware } from './social-media-bot-middleware';

import { socketIoHandler } from './socket-io-handler';
import { twilioHandler } from './twilio-handler';
import { errorHandling } from './error-handling';
errorHandling(emailer);

import { apiRouter } from './api-router';

//let db_facade : DbFacadeInterface = new InMemoryDbFacade();
setup(MONGODB_URI)
  .then(db_facade => {
    winston.info('MongoDB now ready for use');

    dataIntermediate = GetDataIntermediary(db_facade, messageSender, emailer);


    // Check to see if the admin user has been created yet. If not, create it.
    dataIntermediate.canAddUser('admin')
    .then(can => {
      if (!can) return;
      winston.info(`Creating admin user with password: ${RACE2_ADMIN_PASSWORD}`);
      dataIntermediate.addUserWithPassword('admin', RACE2_ADMIN_PASSWORD, {
        name: "Administrator",
        email: GMAIL_USER,
        phone: "",
        level: UserPrivileges.SUPERUSER
      })
    });

    let mongoSessionStore = new MongoStore({
      db: db_facade.db,
      autoReconnect: true
    });

    const commonSessionInfo = {
      secret: SESSION_SECRET,
      // key: SESSION_KEY,
      store: mongoSessionStore
    }
    
    app.use(expressSession({
      resave: true,
      saveUninitialized: true,
      ...commonSessionInfo
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    socketIoHandler(io, messageSender, cookieParser, commonSessionInfo, winston);

    

    http.listen(PORT, function() {
      winston.info(`App now listening on port: ${PORT}`);
    });

   twilioHandler(app, twilio, winston, dataIntermediate);

   let api = apiRouter(emailer, twilioClient, dataIntermediate, db_facade)

    app.use('/r2bcknd', api);

    app.use(socialMediaBotMiddleware(dataIntermediate));
    app.use(express.static('dist'));
    app.get('/*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' })
    })

}).catch(err => {
  console.error('error setting up server', err);
});
