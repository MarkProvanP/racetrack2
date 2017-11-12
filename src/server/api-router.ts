import * as express from 'express';

import { Emailer } from './emailer';
import { TWILIO_SENDING_NO, TWILIO_SID, TWILIO_AUTH_TOKEN } from './constants';
import { DataIntermediary } from './data-intermediate';
import { AuthWithDataIntermediary } from "./auth";
import { DbFacadeInterface } from './db/db-facade';

import teamsRouterWithDb from "./routes/teams.routes";
import publicRouterWithDb from "./routes/public.routes";
import racersRouterWithDb from "./routes/racers.routes";
import textsRouterWithDb from "./routes/texts.routes";
import updatesRouterWithDb from "./routes/updates.routes";
import eventsRouterWithDb from "./routes/events.routes";
import usersRouterWithDb from "./routes/users.routes";
import miscRouterWithDb from "./routes/misc.routes";

export function apiRouter(emailer: Emailer, twilioClient, dataIntermediate: DataIntermediary, db_facade: DbFacadeInterface) {
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

    return apiRouter;
}