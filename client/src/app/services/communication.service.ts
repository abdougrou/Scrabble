import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { ChatMessage } from '@app/classes/message';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { LobbyConfig } from '@common/lobby-config';
import {
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
    UpdateMessage,
} from '@common/socket-messages';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { MultiplayerGameManagerService } from './multiplayer-game-manager.service';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    lobbyKey: string;
    playerName: string;
    started = false;
    config: LobbyConfig;
    gameManager: MultiplayerGameManagerService;
    guestName: string;
    serverMessage: BehaviorSubject<ChatMessage> = new BehaviorSubject({ user: '', body: '' });
    private socket: io.Socket;
    private httpOptions = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    constructor(private readonly http: HttpClient) {
        this.socket = io.io('ws://localhost:3000');

        this.socket.on(SocketEvent.setTimer, () => {
            this.gameManager.turnDurationLeft = this.gameManager.turnDuration;
        });
    }

    setGameManager(gameManager: MultiplayerGameManagerService) {
        this.gameManager = gameManager;
    }

    createLobby(config: LobbyConfig): string {
        const obsPut = this.putLobby(config);
        obsPut.pipe(map((message: { key: string }) => message)).subscribe((message) => {
            this.joinLobby(message.key, config.host);
        });
        return this.lobbyKey;
    }

    joinLobby(key: string, playerName: string) {
        this.lobbyKey = key;
        this.playerName = playerName;
        this.socket.emit(SocketEvent.playerJoinLobby, { lobbyKey: key, playerName } as JoinLobbyMessage);
        this.update();
    }

    setConfig(config: LobbyConfig, guestName: string) {
        config.key = this.lobbyKey;
        this.socket.emit(SocketEvent.setConfig, { lobbyKey: this.lobbyKey, config, guest: guestName } as SetConfigMessage);
        this.socket.on('start game', (message: SetConfigMessage) => {
            this.started = true;
            this.config = message.config;
            this.guestName = message.guest;
        });
    }

    setPlayers() {
        this.update();
    }

    update() {
        this.socket.emit(SocketEvent.update, { lobbyKey: this.lobbyKey } as UpdateMessage);
        this.socket.on(SocketEvent.update, (gameManager: UpdateGameManagerMessage) => {
            let playerIndex = 0;
            for (const serverPlayer of gameManager.players) {
                const player: Player = { name: serverPlayer.name, score: serverPlayer.score, easel: new Easel(serverPlayer.easel.split('')) };
                this.gameManager.players[playerIndex] = player;
                playerIndex++;
            }
            this.gameManager.reserve.data = gameManager.reserveData;
            this.gameManager.reserve.size = gameManager.reserveCount;
            this.gameManager.board.data = gameManager.boardData;
            this.gameManager.gridService.drawBoard();
            this.gameManager.emitChanges();
        });
    }

    switchPlayers() {
        this.socket.emit(SocketEvent.switchPlayers, { lobbyKey: this.lobbyKey } as SwitchPlayersMessage);
        this.update();
    }

    exchangeLetters(letters: string, player: Player) {
        const playerData = { name: player.name, score: player.score, easel: player.easel.toString() };
        this.socket.emit(SocketEvent.exchangeLetters, { lobbyKey: this.lobbyKey, playerData, letters } as ExchangeLettersMessage);
        this.update();
    }

    placeLetters(player: Player, word: string, coord: Vec2, across: boolean) {
        const playerData = { name: player.name, score: player.score, easel: player.easel.toString() };
        this.socket.emit(SocketEvent.placeLetters, { lobbyKey: this.lobbyKey, playerData, word, coord, across } as PlaceLettersMessage);
        this.update();
    }

    skipTurn(player: Player) {
        const playerData = { name: player.name, score: player.score, easel: player.easel.toString() };
        this.socket.emit(SocketEvent.skipTurn, { lobbyKey: this.lobbyKey, playerData } as SkipTurnMessage);
        this.update();
    }

    showReserve() {
        this.socket.emit(SocketEvent.reserve, { lobbyKey: this.lobbyKey } as ShowReserveMessage);
        this.update();
    }

    sendMessage(message: ChatMessage) {
        this.socket.emit(SocketEvent.chatMessage, { lobbyKey: this.lobbyKey, playerName: message.user, message: message.body } as NormalChatMessage);
        this.socket.on(SocketEvent.chatMessage, (msg) => {
            this.serverMessage.next({ user: msg.split(':')[0].trim(), body: msg.split(':')[1] });
        });
    }

    leaveLobby() {
        this.socket.emit(SocketEvent.playerLeaveLobby, { lobbyKey: this.lobbyKey, playerName: this.playerName } as LeaveLobbyMessage);
    }

    // TODO remove default value for testing purposes only
    // startMultiplayerGame(playerName: string, roomId: number = 0): boolean {
    //     this.socket.emit('start multiplayer game', playerName);
    //     this.socket.emit('on user join room', playerName, roomId);
    //     return true;
    // }

    getLobbies(): Observable<LobbyConfig[]> {
        return this.http
            .get<LobbyConfig[]>('http://localhost:3000/api/lobby', this.httpOptions)
            .pipe(catchError(this.handleError<LobbyConfig[]>('getLobbies')));
    }

    putLobby(lobbyConfig: LobbyConfig): Observable<{ key: string }> {
        return this.http
            .put<{ key: string }>('http://localhost:3000/api/lobby', lobbyConfig, this.httpOptions)
            .pipe(catchError(this.handleError<{ key: string }>('putLobby')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
