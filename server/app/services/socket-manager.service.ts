import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { LobbyService } from './lobby.service';

@Service()
export class SocketManagerService {
    private socket: io.Server;

    // private lastAvailableRoom: string | undefined = undefined;
    constructor(server: http.Server, private lobbyService: LobbyService) {
        // eslint-disable-next-line no-console
        console.log('allo');
        this.socket = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST', 'DELETE'] } });
    }

    handleSockets() {
        // TODO move socket event names to static folder as constants and use in client as well
        this.socket.on('connection', (socket) => {
            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            // socket.emit('user connected', socket.id);

            // TODO merge playerName and roomId into single interface to facilitate communication process
        });

        this.socket.on('start-multiplayer-game', (playerName: string) => {
            // eslint-disable-next-line no-console
            console.log(`Player ${playerName} is starting a multiplayer game`);
        });

        this.socket.on('on-join-room', (key: string) => {
            // TODO if the key is not registered send an error message
            this.lobbyService.getLobby(key);
        });
    }
}
