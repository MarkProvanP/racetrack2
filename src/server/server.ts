const HTTPS_FORCE = Boolean(process.env.HTTPS_FORCE);
const ON_HEROKU = process.env.NODE && ~process.env.NODE.indexOf("heroku");

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
let io = require('socket.io')(http);
let passportSocketIo = require('passport.socketio');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let twilio = require('twilio');

import { APP_NAME, APP_URL, HOSTNAME, PORT, MONGODB_URI, TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_SENDING_NO, TWILIO_SMS_WEBHOOK, RACE2_ADMIN_PASSWORD } from './constants';

if (!RACE2_ADMIN_PASSWORD) {
  console.error("RACE2_ADMIN_PASSWORD environment variable must be set before use!");
  process.exit(1);
}

let twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

import { UserPrivileges, UserId } from "../common/user";
import { Racer } from '../common/racer';
import { Team } from '../common/team';
import { Text, TwilioInboundText, TwilioOutboundText } from "../common/text";
import { 
  AbstractMessage,
  TextReceivedMessage,
  TextSentMessage,
  TextUpdatedMessage,
  UserLoggedInMessage,
  UserLoggedOutMessage,
  OtherLoggedInUsersMessage,
  CLOSE_SOCKET
} from "../common/message";


var path = require('path');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());

// Let's Encrypt!
const ACME_CHALLENGES = process.env.ACME_CHALLENGES;
if (ACME_CHALLENGES) {
  let challenges = JSON.parse(ACME_CHALLENGES);
  challenges.forEach(({request, response}) => {
    app.get(request, (req, res) => {
      res.send(response);
    })
  });
}

const SESSION_SECRET = 'kewbfklebhfrhaewbfabfjbhzsfkjbkasjbvhkjaswbhdrvfkashbfvhavfha';
const SESSION_KEY = "express.sid";

import { UserWithoutPassword } from "../common/user";
import { AuthWithDataIntermediary } from "./auth";

import teamsRouterWithDb from "./routes/teams.routes";
import publicRouterWithDb from "./routes/public.routes";
import racersRouterWithDb from "./routes/racers.routes";
import textsRouterWithDb from "./routes/texts.routes";
import updatesRouterWithDb from "./routes/updates.routes";
import eventsRouterWithDb from "./routes/events.routes";
import usersRouterWithDb from "./routes/users.routes";
import miscRouterWithDb from "./routes/misc.routes";

import { SavedConfig, GetDataIntermediary } from "./data-intermediate";
import { DbFacadeInterface } from './db/db-facade';
import { setup } from './db/mongo-db-facade';

function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  console.log('failed connection to socket.io', message);
  accept(new Error("not allowed!"));
}

let dataIntermediate;

import { Emailer } from './emailer';

let emailer = new Emailer();

import { newlineReplace } from './utils';
const GMAIL_USER = process.env.GMAIL_USER;

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection!', reason, promise);
  emailer.sendUnhandledRejectionEmail(reason, promise)
  .catch(err => {
    console.error('Oh noes! An error occured while trying to handle an error! This is absolutely awful!')
    console.error('New error', err);
  });
});

process.on('uncaughtException', (exception) => {
  console.error('Uncaught exception!', exception);
  emailer.sendUncaughtExceptionEmail(exception)
  .catch(err => {
    console.error('Oh noes! An error occured while trying to handle an error! This is absolutely awful!')
    console.error('New error', err);
  });
});

import { MessageSender } from './message-sender';

let messageSender = new MessageSender();

import { socialMediaBotMiddleware } from './social-media-bot-middleware';

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
    
    app.use(expressSession({
      secret: SESSION_SECRET,
      key: SESSION_KEY,
      resave: true,
      saveUninitialized: true,
      store: mongoSessionStore
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    io.use(passportSocketIo.authorize({
      cookieParser: cookieParser,
      key: SESSION_KEY,
      secret: SESSION_SECRET,
      store: mongoSessionStore,
      success: onAuthorizeSuccess,
      fail: onAuthorizeFail
    }));

    io.on('connection', function(socket) {
      let socketUser = socket.request.user;
      winston.log('info', `Socket.io connection from web client started, username: ${socketUser.name}`);
      console.log('Users now', messageSender.sockets.map(client => client.request.user));

      let userLoggedInMessage = new UserLoggedInMessage(socketUser);
      messageSender.sendMessageToWebClients(userLoggedInMessage, socket);

      let otherLoggedInUsers = messageSender.sockets.map(client => client.request.user);
      let otherLoggedInUsersMessage = new OtherLoggedInUsersMessage(otherLoggedInUsers);
      socket.emit(OtherLoggedInUsersMessage.event, otherLoggedInUsersMessage);

      messageSender.addClient(socket);

      socket.on(CLOSE_SOCKET, () => {
        socket.disconnect();
      });

      socket.on('disconnect', function() {
        winston.log('info', 'Socket.io connection from web client ended');
        messageSender.removeClient(socket);
        console.log('Users now', messageSender.sockets.map(client => client.request.user));

        let userLoggedOutMessage = new UserLoggedOutMessage(socketUser);
        messageSender.sendMessageToWebClients(userLoggedOutMessage, socket);
      });
    });

    let apiRouter = express.Router();

    let authRouter = AuthWithDataIntermediary(dataIntermediate);
    apiRouter.use('/auth', authRouter);

    let teamsRouter = teamsRouterWithDb(dataIntermediate);
    apiRouter.use('/teams', teamsRouter);

    let racersRouter = racersRouterWithDb(dataIntermediate);
    apiRouter.use("/racers", racersRouter);

    let twilioObj = {
      client: twilioClient,
      fromNumber: TWILIO_SENDING_NO
    }
    let textsRouter = textsRouterWithDb(dataIntermediate, twilioObj, TWILIO_SID, TWILIO_AUTH_TOKEN);
    apiRouter.use("/texts", textsRouter);

    let updatesRouter = updatesRouterWithDb(dataIntermediate);
    apiRouter.use("/updates", updatesRouter);

    let eventsRouter = eventsRouterWithDb(db_facade);
    apiRouter.use('/events', eventsRouter);

    let usersRouter = usersRouterWithDb(dataIntermediate);
    apiRouter.use('/users', usersRouter);

    let publicRouter = publicRouterWithDb(dataIntermediate);
    apiRouter.use('/public', publicRouter);

    let miscRouter = miscRouterWithDb(dataIntermediate);
    apiRouter.use('/misc', miscRouter);

    apiRouter.post("/email", (req, res) => {
      let mailOptions = req.body;
      emailer.sendEmail(
        mailOptions.to,
        mailOptions.subject,
        mailOptions.html
      )
      .then(messageInfo => {
        console.log(messageInfo);
        res.send(messageInfo);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      })
    })

    http.listen(PORT, function() {
      winston.info(`App now listening on port: ${PORT}`);
    });

    app.post('/twiml', function(req, res) {
      if (twilio.validateExpressRequest(req, TWILIO_AUTH_TOKEN, {url: TWILIO_SMS_WEBHOOK})) {
        let text = req.body;
        winston.log('verbose', `Received text from Twilio`, {text});
        dataIntermediate.addNewReceivedText(text)
        .then(success => {
          let response = new twilio.TwimlResponse();
          res.send(response.toString());
        })
        .catch(err => {
          winston.error('Could not add inbound Twilio text to database!', {text, err});
          res.status(500).send(err);
        });
      } else {
        winston.warn('Invalid Twilio request received!');
        res.status(403).send("Error, you're not twilio!");
      }
    });

    app.use('/r2bcknd', apiRouter);

    app.use(socialMediaBotMiddleware(dataIntermediate));
    app.use(express.static('dist'));
    app.get('/*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' })
    })

}).catch(err => {
  console.error('error setting up server', err);
});
