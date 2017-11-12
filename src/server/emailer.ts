import * as nodemailer from "nodemailer";
import * as pug from "pug";

import { UserWithoutPassword } from '../common/user';
import { TwilioInboundText, TwilioOutboundText } from '../common/text';
import { newlineReplace } from './utils';
import { APP_NAME, APP_URL, HOSTNAME, GMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } from './constants';


const ERROR_EMAIL_RECIPIENTS = [GMAIL_USER].concat(process.env.ERROR_EMAIL_RECIPIENTS.split(","));
const STATUS_EMAIL_RECIPIENTS = [GMAIL_USER].concat(process.env.STATUS_EMAIL_RECIPIENTS.split(","));
const DATA_EMAIL_RECIPIENTS = [GMAIL_USER].concat(process.env.DATA_EMAIL_RECIPIENTS.split(","));
console.log(`Will send error emails to ${ERROR_EMAIL_RECIPIENTS}`);
console.log(`Will send status emails to ${STATUS_EMAIL_RECIPIENTS}`);
console.log(`Will send data emails to ${DATA_EMAIL_RECIPIENTS}`);


const XOAUTH2_SETTINGS = {
    user: GMAIL_USER,
    clientId: GMAIL_CLIENT_ID,
    clientSecret: GMAIL_CLIENT_SECRET,
    refreshToken: GMAIL_REFRESH_TOKEN,
  }

const EMAIL_TEMPLATES = {
  userCreated: pug.compileFile("src/email-templates/user-created.pug"),
  passwordReset: pug.compileFile("src/email-templates/password-reset.pug"),
  unhandledRejection: pug.compileFile("src/email-templates/unhandled-rejection.pug"),
  uncaughtException: pug.compileFile("src/email-templates/uncaught-exception.pug"),
  textSent: pug.compileFile("src/email-templates/text-sent.pug"),
  textReceived: pug.compileFile("src/email-templates/text-received.pug"),
  serverStarted: pug.compileFile("src/email-templates/server-started.pug")
}

export class Emailer {
    private smtpTransport;
  
    constructor() {
      this.smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: XOAUTH2_SETTINGS
      })
  
      this.smtpTransport.verify((err, success) => {
        if (err) {
          console.error('Error with SMTP transport!', err)
        } else {
          console.log('SMTP transport ready!')
        }
      })
    }
  
    sendEmail(to: string[] | string, subject: string, bodyHtml: string) {
      let mailOptions = {
        from: {
          name: APP_NAME,
          address: GMAIL_USER
        },
        to: to,
        subject: subject,
        generateTextFromHTML: true,
        html: bodyHtml
      };
      return new Promise((resolve, reject) => {
        this.smtpTransport.sendMail(mailOptions, (err, res) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(res);
            resolve(res);
          }
        })
      });
    }
  
    sendUserCreatedEmail(user: UserWithoutPassword, password: string) {
      let emailHTMLString = EMAIL_TEMPLATES.userCreated({
        APP_NAME: APP_NAME,
        USER_NAME: user.name,
        USER_USERNAME: user.username,
        APP_URL: APP_URL,
        USER_PASSWORD: password
      })
      return this.sendEmail(
        user.email,
        `Welcome to ${APP_NAME}, ${user.name}`,
        emailHTMLString
      )
    }
  
    sendPasswordResetEmail(to: string, password: string) {
      let emailHTMLString = EMAIL_TEMPLATES.passwordReset({
        APP_NAME: APP_NAME,
        APP_URL: APP_URL,
        PASSWORD: password
      })
      return this.sendEmail(
        to,
        `${APP_NAME} Password Reset`,
        emailHTMLString
      )
    }
  
    sendUnhandledRejectionEmail(reason, promise) {
      let stacktrace = newlineReplace(String(reason.stack));
      let promiseString = newlineReplace(String(promise));
      let emailHTMLString = EMAIL_TEMPLATES.unhandledRejection({
        APP_NAME: APP_NAME,
        DATE: new Date(),
        PROMISE_STRING: promiseString,
        STACKTRACE: stacktrace,
        HOSTNAME: HOSTNAME
      })
      return this.sendEmail(
        ERROR_EMAIL_RECIPIENTS,
        `${APP_NAME} - Unhandled rejection!`,
        emailHTMLString
      )
    }
  
    sendUncaughtExceptionEmail(exception) {
      let stacktrace = newlineReplace(exception.stack);
      let emailHTMLString = EMAIL_TEMPLATES.uncaughtException({
        APP_NAME: APP_NAME,
        DATE: new Date(),
        STACKTRACE: stacktrace,
        HOSTNAME: HOSTNAME
      })
      return this.sendEmail(
        ERROR_EMAIL_RECIPIENTS,
        `${APP_NAME} - Uncaught Exception!`,
        emailHTMLString
      )
    }
  
    sendTextSentEmail(text: TwilioOutboundText) {
      let emailHTMLString = EMAIL_TEMPLATES.textSent({
        APP_NAME: APP_NAME,
        TEXT_RECIPIENT: text.to,
        TEXT_BODY: text.body
      })
      return this.sendEmail(
        DATA_EMAIL_RECIPIENTS,
        `${APP_NAME} - Text sent to ${text.to}`,
        emailHTMLString
      )
    }
  
    sendTextReceivedEmail(text: TwilioInboundText) {
      let emailHTMLString = EMAIL_TEMPLATES.textReceived({
        APP_NAME: APP_NAME,
        TEXT_SENDER: text.From,
        TEXT_BODY: text.Body
      })
      return this.sendEmail(
        DATA_EMAIL_RECIPIENTS,
        `${APP_NAME} - Text Received from ${text.From}`,
        emailHTMLString
      )
    }
    
    sendServerStartedEmail() {
      let emailHTMLString = EMAIL_TEMPLATES.serverStarted({
        APP_NAME: APP_NAME,
        DATE: new Date(),
        HOSTNAME: HOSTNAME
      })
      return this.sendEmail(
        STATUS_EMAIL_RECIPIENTS,
        "Server started!",
        emailHTMLString
      )
    }
  }