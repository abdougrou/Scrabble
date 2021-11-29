import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { ExchangeResult, PassResult, PlaceResult } from '@common/command-result';
import {
    DeleteLobbyMessage,
    ExchangeLettersMessage,
    JoinLobbyMessage,
    LeaveLobbyMessage,
    NormalChatMessage,
    PlaceLettersMessage,
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
            });

            socket.on(SocketEvent.setConfig, (message: SetConfigMessage) => {
                const lobby = this.lobbyService.getLobby(message.lobbyKey);
                if (lobby?.started)
                    this.io.to(message.lobbyKey).emit('start game', {
                        lobbyKey: message.lobbyKey,
                        config: message.config,
                        guest: message.guest,
                        players: lobby.gameManager.players,
                    } as SetConfigMessage);
            });

            socket.on(SocketEvent.deleteLobby, (message: DeleteLobbyMessage) => {
                this.lobbyService.deleteLobby(message.lobbyKey);
            });

            socket.on(SocketEvent.switchPlayers, (message: SwitchPlayersMessage) => {
                this.lobbyService.getLobby(message.lobbyKey)?.gameManager.swapPlayers();
                this.io.to(message.lobbyKey).emit(SocketEvent.setTimer);
            });

            socket.on(SocketEvent.exchangeLetters, (message: ExchangeLettersMessage) => {
                const player = this.lobbyService.getLobby(message.lobbyKey)?.gameManager.getPlayer(message.playerData.name) as Player;
                player.score = message.playerData.score;
                player.easel = new Easel(message.playerData.easel.split(''));
                switch (this.lobbyService.getLobby(message.lobbyKey)?.gameManager.exchangeLetters(player, message.letters)) {
                    case ExchangeResult.NotCurrentPlayer:
                        socket.emit(SocketEvent.chatMessage, `${player} : "Ce n'est pas votre tour"`);
                        break;
                    case ExchangeResult.NotInEasel:
                        socket.emit(SocketEvent.chatMessage, `${player} : 'Votre chevalet ne contient pas les lettres nécessaires'`);
                        break;
                    case ExchangeResult.NotEnoughInReserve:
                        socket.emit(SocketEvent.chatMessage, `${player} : "Il n'y a pas assez de tuiles dans la réserve"`);
                        break;
                    case ExchangeResult.Success:
                        this.io.to(message.lobbyKey).emit(SocketEvent.setTimer);
                        socket.emit(SocketEvent.chatMessage, `Commande : ${player} a échangé les lettres ${message.letters}`);
                        socket.broadcast.emit(SocketEvent.chatMessage, `Commande : ${player} a échangé  ${message.letters.length} lettres`);
                        break;
                }
            });

            socket.on(SocketEvent.placeLetters, (message: PlaceLettersMessage) => {
                const player = this.lobbyService.getLobby(message.lobbyKey)?.gameManager.getPlayer(message.playerData.name) as Player;
                player.score = message.playerData.score;
                player.easel = new Easel(message.playerData.easel.split(''));
                switch (
                    this.lobbyService
                        .getLobby(message.lobbyKey)
                        ?.gameManager.placeLetters(player as Player, message.word, message.coord, message.across)
                ) {
                    case PlaceResult.NotCurrentPlayer:
                        socket.emit(SocketEvent.chatMessage, `${player} : Ce n'est pas votre tour`);
                        break;
                    case PlaceResult.NotValid:
                        socket.emit(SocketEvent.chatMessage, `${player} : Commande impossible à realiser`);
                        break;
                    case PlaceResult.NotInEasel:
                        socket.emit(SocketEvent.chatMessage, `${player} : Commande impossible à realiser`);
                        break;
                    case PlaceResult.Success: {
                        this.io.to(message.lobbyKey).emit(SocketEvent.setTimer);
                        this.io
                            .to(message.lobbyKey)
                            .emit(
                                SocketEvent.chatMessage,
                                `Commande : ${player} a placé le mot "${message.word}" ${
                                    message.across ? 'horizontale' : 'verticale'
                                }ment à la case ${message.coord}`,
                            );
                        this.lobbyService.getLobby(message.lobbyKey)?.gameManager.swapPlayers();
                        /* const gameManager = this.lobbyService.getLobby(message.lobbyKey)?.gameManager;
                        const serverPlayers: PlayerData[] = [];
                        for (const serverPlayer of gameManager?.players as Player[]) {
                            const playerData: PlayerData = {
                                name: serverPlayer.name,
                                score: serverPlayer.score,
                                easel: serverPlayer.easel.toString(),
                            };
                            serverPlayers.push(playerData);
                        } */
                        // (gameManager as GameManager).board.data = transpose(gameManager?.board.data as (string | null)[][]) as (string | null)[][];
                        this.update(message.lobbyKey);
                        // (gameManager as GameManager).board.data = transpose(gameManager?.board.data as (string | null)[][]) as (string | null)[][];
                        break;
                    }
                }
            });

            socket.on(SocketEvent.skipTurn, (message: SkipTurnMessage) => {
                const player = this.lobbyService.getLobby(message.lobbyKey)?.gameManager.getPlayer(message.playerData.name) as Player;
                player.score = message.playerData.score;
                player.easel = new Easel(message.playerData.easel.split(''));
                switch (this.lobbyService.getLobby(message.lobbyKey)?.gameManager.passTurn(player)) {
                    case PassResult.NotCurrentPlayer:
                        socket.emit(SocketEvent.chatMessage, `${player} : "Ce n'est pas votre tour"`);
                        break;
                    case PassResult.Success:
                        this.io.to(message.lobbyKey).emit(SocketEvent.setTimer);
                        this.io.to(message.lobbyKey).emit(SocketEvent.chatMessage, `${player} a passé son tour`);
                        break;
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
        /* const serverPlayers: PlayerData[] = [];
        for (const serverPlayer of gameManager?.players as Player[]) {
            const player: PlayerData = { name: serverPlayer.name, score: serverPlayer.score, easel: serverPlayer.easel.toString() };
            serverPlayers.push(player);
        }*/
        this.io.to(key).emit(SocketEvent.update, {
            players: gameManager?.players,
            reserveData: gameManager?.reserve.data,
            reserveCount: gameManager?.reserve.size,
            boardData: gameManager?.board.data,
        } as UpdateGameManagerMessage);
    }
}
