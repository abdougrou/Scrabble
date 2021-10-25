import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
@Service()
export class SocketManagerService {
    private socket: io.Server;
    private roomId = 0;
    private rooms: Map<number, string[]> = new Map<number, string[]>();
    // private lastAvailableRoom: string | undefined = undefined;
    constructor(server: http.Server) {
        this.socket = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST', 'DELETE'] } });
    }

    handleSockets() {
        console.log('allo');
        // TODO move socket event names to static folder as constants and use in client as well
        this.socket.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.emit('user connected', socket.id);
            socket.on('start multiplayer game', (playerName: string) => {
                console.log(`Player ${playerName} is starting a multiplayer game`);
            });
            // TODO merge playerName and roomId into single interface to facilitate communication process
            socket.on('on user join room', (roomId: number, playerName: string) => {
                // TODO if the key is not registered send an error message
                this.rooms.get(roomId)?.push(playerName);
                socket.broadcast.emit('room unavailable', roomId);
            });
            socket.on('user created room', (playerName: string) => {
                const roomId = this.roomGenerator();
                this.rooms.set(roomId, [playerName]);
                socket.broadcast.emit('room created', roomId);
            });
        });
    }

    private roomGenerator(): number {
        return this.roomId++;
    }
}
