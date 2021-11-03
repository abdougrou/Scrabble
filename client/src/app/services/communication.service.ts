import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dictionary, GameConfig } from '@app/classes/game-config';
import { Lobby, LobbyConfig } from '@common/lobby';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    lobbyKey: string;
    private socket: io.Socket;
    private httpOptions = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    constructor(private readonly http: HttpClient) {
        this.socket = io.io('ws://localhost:3000');
    }

    createLobby(gameConfig: GameConfig): string {
        // eslint-disable-next-line no-console
        // console.log(`Client socket id : ${this.socket.id}`);
        // this.enableListeners();
        const lobbyConfig: LobbyConfig = {
            host: gameConfig.playerName1,
            turnDuration: gameConfig.duration,
            bonusEnabled: gameConfig.bonusEnabled,
            dictionary: gameConfig.dictionary === Dictionary.French ? 'Français' : 'Anglais',
        };

        // this.putLobby(gameConfig);
        const obsPut = this.putLobby(lobbyConfig);
        obsPut.pipe(map((message: { key: string }) => message)).subscribe((message) => {
            this.lobbyKey = message.key;
        });
        return this.lobbyKey;
    }

    joinLobby(key: string): void {
        console.log(key);
        this.socket.emit('on-join-room', key);
    }

    // TODO remove default value for testing purposes only
    // startMultiplayerGame(playerName: string, roomId: number = 0): boolean {
    //     this.socket.emit('start multiplayer game', playerName);
    //     this.socket.emit('on user join room', playerName, roomId);
    //     return true;
    // }

    getLobbies(): Observable<Lobby[]> {
        return this.http.get<Lobby[]>('http://localhost:3000/api/lobby', this.httpOptions).pipe(catchError(this.handleError<Lobby[]>('getLobbies')));
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
