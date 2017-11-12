import { AbstractMessage } from '../common/message';

export class MessageSender {
    sockets = [];
  
    constructor() {
  
    }
  
    addClient(socket) {
      this.sockets.push(socket);
    }
  
    removeClient(socket) {
      let index = this.sockets.indexOf(socket);
      if (index > -1) {
        this.sockets.splice(index, 1);
      }
    }
  
    sendMessageToWebClients(message: AbstractMessage, excluded?) {
      let event = message.getEvent();
      console.log('sending message to web clients', message);
      this.sockets.forEach(socket => {
        if (socket != excluded) {
          socket.emit(event, message);
        } else {
          console.log('excluding socket');
        }
      });
    }
  }