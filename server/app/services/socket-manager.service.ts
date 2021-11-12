import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { ExchangeResult, PassResult, PlaceResult } from '@common/command-result';
import {
    ExchangeLettersMessage,
    JoinLobbyMessage,
    LeaveLobbyMessage,
    NormalChatMessage,
    PlaceLettersMessage,
    PlayerData,
    SetConfigMessage,
    ShowReserveMessage,
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
                socket.join(message.lobbyKey);
                this.update(message.lobbyKey);
            });

            socket.on(SocketEvent.setConfig, (message: SetConfigMessage) => {
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
                let commandResult = '';
                let privateResult = true;
                const player = this.lobbyService.getLobby(message.lobbyKey)?.gameManager.getPlayer(message.playerData.name) as Player;
                player.score = message.playerData.score;
                player.easel = new Easel(message.playerData.easel.split(''));
                switch (this.lobbyService.getLobby(message.lobbyKey)?.gameManager.exchangeLetters(player, message.letters)) {
                    case ExchangeResult.NotCurrentPlayer:
                        privateResult = true;
                        commandResult = "Ce n'est pas votre tour";
                        break;
                    case ExchangeResult.NotInEasel:
                        privateResult = true;
                        commandResult = 'Votre chevalet ne contient pas les lettres nécessaires';
                        break;
                    case ExchangeResult.NotEnoughInReserve:
                        privateResult = true;
                        commandResult = "Il n'y a pas assez de tuiles dans la réserve";
                        break;
                    case ExchangeResult.Success:
                        privateResult = false;
                        break;
                }
                if (privateResult) {
                    socket.emit(SocketEvent.chatMessage, `${player} : ${commandResult}`);
                } else {
                    socket.emit(SocketEvent.chatMessage, `Commande : ${player} a échangé les lettres ${message.letters}`);
                    socket.broadcast.emit(SocketEvent.chatMessage, `Commande : ${player} a échangé  ${message.letters.length} lettres`);
                }
            });

            socket.on(SocketEvent.placeLetters, (message: PlaceLettersMessage) => {
                let commandResult = '';
                let privateResult = true;
                const player = this.lobbyService.getLobby(message.lobbyKey)?.gameManager.getPlayer(message.playerData.name) as Player;
                player.score = message.playerData.score;
                player.easel = new Easel(message.playerData.easel.split(''));
                switch (
                    this.lobbyService
                        .getLobby(message.lobbyKey)
                        ?.gameManager.placeLetters(player as Player, message.word, message.coord, message.across)
                ) {
                    case PlaceResult.NotCurrentPlayer:
                        privateResult = true;
                        commandResult = "Ce n'est pas votre tour";
                        break;
                    case PlaceResult.NotValid:
                        privateResult = true;
                        commandResult = 'Commande impossible à realiser';
                        break;
                    case PlaceResult.Success:
                        privateResult = false;
                        break;
                }
                if (privateResult) {
                    socket.emit(SocketEvent.chatMessage, `${player} : ${commandResult}`);
                } else {
                    this.io
                        .to(message.lobbyKey)
                        .emit(
                            SocketEvent.chatMessage,
                            `Commande : ${player} a placé le mot "${message.word}" ${message.across ? 'horizontale' : 'verticale'}ment à la case ${
                                message.coord
                            }`,
                        );
                    this.lobbyService.getLobby(message.lobbyKey)?.gameManager.swapPlayers();
                    this.update(message.lobbyKey);
                }
            });

            socket.on(SocketEvent.skipTurn, (message: SkipTurnMessage) => {
                let commandResult = 'error';
                let privateResult = true;
                const player = this.lobbyService.getLobby(message.lobbyKey)?.gameManager.getPlayer(message.playerData.name) as Player;
                player.score = message.playerData.score;
                player.easel = new Easel(message.playerData.easel.split(''));
                switch (this.lobbyService.getLobby(message.lobbyKey)?.gameManager.passTurn(player)) {
                    case PassResult.NotCurrentPlayer:
                        privateResult = true;
                        commandResult = "Ce n'est pas votre tour";
                        break;
                    case PassResult.Success:
                        privateResult = false;
                        break;
                }
                if (privateResult) {
                    socket.emit(SocketEvent.chatMessage, `${player} : ${commandResult}`);
                } else {
                    this.io.to(message.lobbyKey).emit(SocketEvent.chatMessage, `${player} a passé son tour`);
                }
            });

            socket.on(SocketEvent.reserve, (message: ShowReserveMessage) => {
                socket.emit(SocketEvent.chatMessage, `Commande : ${this.lobbyService.getLobby(message.lobbyKey)?.gameManager.printReserve()}`);
            });

            socket.on(SocketEvent.chatMessage, (message: NormalChatMessage) => {
                this.io.to(message.lobbyKey).emit(SocketEvent.chatMessage, `${message.playerName} : ${message.message}`);
            });

            socket.on(SocketEvent.playerLeaveLobby, (message: LeaveLobbyMessage) => {
                this.lobbyService.playerLeaveLobby(message.playerName, message.lobbyKey);
            });

            socket.on(SocketEvent.update, (message: UpdateMessage) => {
                this.update(message.lobbyKey);
            });

            socket.on('disconnection', () => {
                const rooms = Object.keys(socket.rooms);
                rooms.forEach((room) => {
                    socket.to(room).emit('player leave lobby');
                });
            });
        });
    }

    update(key: string) {
        const gameManager = this.lobbyService.getLobby(key)?.gameManager;
        const serverPlayers: PlayerData[] = [];
        for (const serverPlayer of gameManager?.players as Player[]) {
            const player: PlayerData = { name: serverPlayer.name, score: serverPlayer.score, easel: serverPlayer.easel.toString() };
            serverPlayers.push(player);
        }
        this.io.to(key).emit(SocketEvent.update, {
            players: serverPlayers,
            reserveData: gameManager?.reserve.data,
            reserveCount: gameManager?.reserve.size,
            boardData: gameManager?.board.data,
        } as UpdateGameManagerMessage);
    }
}
