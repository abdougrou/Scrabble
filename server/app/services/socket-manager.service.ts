import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { GameConfig } from '@common/game-config';

const ROOM_PREFIX = 'multiplayer-';

@Service()
export class SocketManagerService {
    private socket: io.Server;
    private roomId = 0;
    // TODO: Create a set of rooms
    private rooms: Map<number, string[]> = new Map<number, string[]>();
    // private lastAvailableRoom: string | undefined = undefined;
    constructor(server: http.Server) {
        console.log("allo");
        this.socket = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST', 'DELETE'] } });
    }

    handleSockets() {
        // TODO move socket event names to static folder as constants and use in client as well
        this.socket.on('connection', (socket) => {
            socket.emit('user connected', socket.id);
            socket.on('start multiplayer game', (playerName: string) => {
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
                socket.join(ROOM_PREFIX + roomId.toFixed());
                socket.broadcast.emit('room created', roomId);
            });
            socket.on('user play', (command: string, gameConfig: GameConfig) => {
                this.socket.to(ROOM_PREFIX + gameConfig.roomID).emit('user played', command);
            });
        });
    }

    private roomGenerator(): number {
        return this.roomId++;
    }
}
