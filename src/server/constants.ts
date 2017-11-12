import { hostname } from "os";

export const APP_NAME = process.env.NG_APP_NAME;
export const APP_URL = process.env.APP_URL;
export const HOSTNAME = hostname();
export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
export const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
export const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const TWILIO_SID = process.env.TWILIO_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_SENDING_NO = process.env.TWILIO_SENDING_NO;
export const TWILIO_SMS_WEBHOOK = process.env.TWILIO_SMS_WEBHOOK;
export const RACE2_ADMIN_PASSWORD = process.env.RACE2_ADMIN_PASSWORD;

export const HTTPS_FORCE = Boolean(process.env.HTTPS_FORCE);
export const ON_HEROKU = process.env.NODE && ~process.env.NODE.indexOf("heroku");
export const ACME_CHALLENGES = process.env.ACME_CHALLENGES;
