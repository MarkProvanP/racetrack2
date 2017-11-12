let passportSocketIo = require('passport.socketio');

import { MessageSender } from './message-sender';
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
function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');
    accept();
}

function onAuthorizeFail(data, message, error, accept) {
    console.log('failed connection to socket.io', message);
    accept(new Error("not allowed!"));
}

export function socketIoHandler(io, messageSender: MessageSender, cookieParser, commonSessionInfo, winston) {
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail,
        ...commonSessionInfo
    }));

    io.on('connection', function (socket) {
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

        socket.on('disconnect', function () {
            winston.log('info', 'Socket.io connection from web client ended');
            messageSender.removeClient(socket);
            console.log('Users now', messageSender.sockets.map(client => client.request.user));

            let userLoggedOutMessage = new UserLoggedOutMessage(socketUser);
            messageSender.sendMessageToWebClients(userLoggedOutMessage, socket);
        });
    });
}