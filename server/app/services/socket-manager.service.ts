import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';

@Service()
export class SocketManagerService {
    private sio: io.Server;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ["GET", "POST"] } });
    } 

    public handleSockets(): void {
        this.sio.on("connection", (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.emit("hello", "By Server");
        });

        this.sio.on('join-lobby', (socket: io.Socket, key: string) => {
            socket.join(key);
        })
    }
}
