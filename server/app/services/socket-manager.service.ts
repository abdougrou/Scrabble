import { Service } from 'typedi';

@Service()
export class SocketManagerService {
    // private socket: io.Server;
    // private lastAvailableRoom: string | undefined = undefined;
    // constructor(lobbyService: LobbyService, server: http.Server) {
    // console.log('allo');
    // this.socket = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST', 'DELETE'] } });
    // }
    // handleSockets() {
    // // TODO move socket event names to static folder as constants and use in client as well
    // this.socket.on('connection', (socket) => {
    //     console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
    //     // socket.emit('user connected', socket.id);
    //     // TODO merge playerName and roomId into single interface to facilitate communication process
    // });
    // this.socket.on('start multiplayer game', (playerName: string) => {
    //     console.log(`Player ${playerName} is starting a multiplayer game`);
    // });
    // this.socket.on('on user join room', (key: string, playerName: string) => {
    //     // TODO if the key is not registered send an error message
    //     lobbyService.getLobby(key);
    // });
    // }
}
