import { JoinLobbyMessage, LeaveLobbyMessage, SocketEvent } from '@common/socket-messages';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { LobbyService } from './lobby.service';

@Service()
export class SocketManagerService {
    private io: io.Server;

    constructor(server: http.Server, private lobbyService: LobbyService) {
        this.io = new io.Server(server, { cors: { origin: '*' } });
    }

    handleSockets() {
        this.io.on('connection', (socket) => {
            socket.on(SocketEvent.playerJoinLobby, (message: JoinLobbyMessage) => {
                this.lobbyService.playerJoinLobby(message.playerName, message.lobbyKey);
            });

            socket.on(SocketEvent.playerLeaveLobby, (message: LeaveLobbyMessage) => {
                this.lobbyService.playerLeaveLobby(message.playerName, message.lobbyKey);
            });

            socket.on('disconnection', () => {
                const rooms = Object.keys(socket.rooms);
                rooms.forEach((room) => {
                    socket.to(room).emit('player leave lobby');
                });
            });
        });
    }
}
