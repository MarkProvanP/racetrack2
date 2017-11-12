import { TWILIO_AUTH_TOKEN, TWILIO_SMS_WEBHOOK } from './constants';
import { DataIntermediary } from './data-intermediate';

export function twilioHandler(app, twilio, winston, dataIntermediate: DataIntermediary) {
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
}