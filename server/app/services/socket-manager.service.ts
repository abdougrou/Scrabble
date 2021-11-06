import { Player } from '@app/classes/player';
import {
    ExchangeLettersMessage,
    JoinLobbyMessage,
    LeaveLobbyMessage,
    PlaceLettersMessage,
    PlayerData,
    SetConfigMessage,
    SkipTurnMessage,
    SocketEvent,
    SwitchPlayersMessage,
    UpdateGameManagerMessage,
    UpdateMessage
} from '@common/socket-messages';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { LobbyService } from './lobby.service';

@Service()
export class SocketManagerService {
    io: io.Server;

    constructor(server: http.Server, private lobbyService: LobbyService) {
        this.io = new io.Server(server, { cors: { origin: '*' } });
    }

    handleSockets() {
        this.io.on('connection', (socket) => {
            socket.on(SocketEvent.playerJoinLobby, (message: JoinLobbyMessage) => {
                this.lobbyService.playerJoinLobby(message.playerName, message.lobbyKey);
                const lobby = this.lobbyService.getLobby(message.lobbyKey);
                if (lobby?.gameManager.players.length === 2) lobby.started = true;
                console.log('(Join) key: ', message.lobbyKey);
                socket.join(message.lobbyKey);
            });

            socket.on(SocketEvent.setConfig, (message: SetConfigMessage) => {
                console.log('(setConfig) key: ', message.lobbyKey);
                console.log('Host : ', message.config.host);
                const lobby = this.lobbyService.getLobby(message.lobbyKey);
                if (lobby?.started)
                    this.io
                        .to(message.lobbyKey)
                        .emit('start game', { lobbyKey: message.lobbyKey, config: message.config, guest: message.guest } as SetConfigMessage);
            });

            socket.on(SocketEvent.switchPlayers, (message: SwitchPlayersMessage) => {
                this.lobbyService.getLobby(message.lobbyKey)?.gameManager.swapPlayers();
            });

            socket.on(SocketEvent.exchangeLetters, (message: ExchangeLettersMessage) => {
                this.lobbyService.getLobby(message.lobbyKey)?.gameManager.exchangeLetters(message.player, message.letters);
            });

            socket.on(SocketEvent.placeLetters, (message: PlaceLettersMessage) => {
                this.lobbyService.getLobby(message.lobbyKey)?.gameManager.placeLetters(message.player, message.word, message.coord, message.across);
            });

            socket.on(SocketEvent.skipTurn, (message: SkipTurnMessage) => {
                this.lobbyService.getLobby(message.lobbyKey)?.gameManager.passTurn(message.player);
            });

            socket.on(SocketEvent.playerLeaveLobby, (message: LeaveLobbyMessage) => {
                this.lobbyService.playerLeaveLobby(message.playerName, message.lobbyKey);
            });

            socket.on(SocketEvent.update, (message: UpdateMessage) => {
                const gameManager = this.lobbyService.getLobby(message.lobbyKey)?.gameManager;
                const serverPlayers: PlayerData[] = [];
                for (const serverPlayer of gameManager?.players as Player[]) {
                    const player: PlayerData = { name: serverPlayer.name, score: serverPlayer.score, easel: serverPlayer.easel.toString() };
                    serverPlayers.push(player);
                }
                this.io.to(message.lobbyKey).emit(SocketEvent.update, {
                    players: serverPlayers,
                    reserveData: gameManager?.reserve.data,
                    reserveCount: gameManager?.reserve.size,
                    boardData: gameManager?.board.data,
                } as UpdateGameManagerMessage);
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
