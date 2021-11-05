import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { GameConfig, LobbyConfig } from '@common/lobby-config';
import {
    ExchangeLettersMessage,
    JoinLobbyMessage,
    LeaveLobbyMessage,
    PlaceLettersMessage,
    SetConfigMessage,
    SkipTurnMessage,
    SocketEvent,
    SwitchPlayersMessage
} from '@common/socket-messages';
import { Observable, of } from 'rxjs';
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
    config: GameConfig;
    gameManager: MultiplayerGameManagerService;
    private socket: io.Socket;
    private httpOptions = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    constructor(private readonly http: HttpClient) {
        this.socket = io.io('ws://localhost:3000');
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
    }

    setConfig(config: GameConfig) {
        // console logs to debug
        // eslint-disable-next-line no-console
        console.log('setConfig Data: ', config);
        this.socket.emit(SocketEvent.setConfig, { lobbyKey: this.lobbyKey, config } as SetConfigMessage);
        this.socket.on('start game', (gameConfig) => {
            // eslint-disable-next-line no-console
            console.log('Server: game started');
            this.started = true;
            this.config = gameConfig;
            // eslint-disable-next-line no-console
            console.log(this.config);
        });
    }

    setPlayers() {
        this.socket.emit(SocketEvent.setPlayers, { lobbyKey: this.lobbyKey } as SetPlayersMessage);
        this.socket.on(SocketEvent.setPlayers, (players) => {
            this.gameManager.players = players;
        });
    }

    // TODO
    startTimer() {}

    switchPlayers() {
        this.socket.emit(SocketEvent.switchPlayers, { lobbyKey: this.lobbyKey } as SwitchPlayersMessage);
    }

    exchangeLetters(letters: string, player: Player) {
        this.socket.emit(SocketEvent.exchangeLetters, { lobbyKey: this.lobbyKey, player, letters } as ExchangeLettersMessage);
    }

    placeLetters(player: Player, word: string, coord: Vec2, across: boolean) {
        this.socket.emit(SocketEvent.placeLetters, { lobbyKey: this.lobbyKey, player, word, coord, across } as PlaceLettersMessage);
    }

    skipTurn(player: Player) {
        this.socket.emit(SocketEvent.skipTurn, { lobbyKey: this.lobbyKey, player } as SkipTurnMessage);
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
