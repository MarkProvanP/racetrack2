import { Emailer } from './emailer';

export function errorHandling(emailer: Emailer) {
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
}